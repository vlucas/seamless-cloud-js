import { fetchJSON } from '../shared/fetch';

/**
 * Seamless.cloud client
 */
export type SeamlessClientConfig = {
  account: string;
  apiKey: string;
  project: string;
  region?: string;
};

export type SeamlessQuery = {
  querySql: string;
  queryVars: { [key: string]: any };
};

export interface ISeamlessClient {
  cfg: SeamlessClientConfig;
  fetchFn: any;
}

export class SeamlessClient implements ISeamlessClient {
  constructor(public cfg: SeamlessClientConfig, public fetchFn: any) {
    this.cfg = cfg;
    this.fetchFn = fetchFn;

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

    return fetchJSON(this.fetchFn, 'POST', seamlessUrl, {
      account: this.cfg.account,
      apiKey: this.cfg.apiKey,
      project: this.cfg.project,
      queryKey,
      querySql,
      queryVars,
    });
  }
}
