import { fetchJSON } from '../shared/fetch';

/**
 * Seamless.cloud client
 */
export type SeamlessClientConfig = {
  account: string;
  apiKey: string;
  project: string;
  region?: string;
  debug?: boolean;
};

export type SeamlessQuery = {
  querySql: string;
  queryVars: { [key: string]: any };
};

export interface ISeamlessClient {
  cfg: SeamlessClientConfig;
  fetchFn: any;
  debug: boolean;
}

export class SeamlessClient implements ISeamlessClient {
  debug: boolean;

  constructor(public cfg: SeamlessClientConfig, public fetchFn: any) {
    this.cfg = cfg;
    this.fetchFn = fetchFn;
    this.debug = cfg.debug || false;

    if (!this.cfg.region) {
      this.cfg.region = 'us-east-2';
    }
  }

  getBaseUrl() {
    return `https://${this.cfg.region}.sqlapi.seamless.cloud/sqlapi`;
  }

  query(queryKey: string, queryObject: SeamlessQuery) {
    const { querySql, queryVars } = queryObject;
    const seamlessUrl = this.getBaseUrl();
    const queryParams = {
      account: this.cfg.account,
      apiKey: this.cfg.apiKey,
      project: this.cfg.project,
      queryKey,
      querySql,
      queryVars,
    };

    if (this.debug) {
      console.log('[seamless-cloud query]: ', seamlessUrl, queryParams);
    }

    return fetchJSON(this.fetchFn, 'POST', seamlessUrl, queryParams);
  }
}
