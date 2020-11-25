import { fetchJSON } from '../shared/fetch';

/**
 * Seamless.cloud client
 */
export type SeamlessClientConfig = {
	apiKey: string,
	project: string,
	username: string,
	region?: string,
};

export type SeamlessQuery = {
  name?: string,
  text?: string,
  sql?: string,
  values?: string[],
}

export interface ISeamlessClient {
  cfg: SeamlessClientConfig,
  fetchFn: any,
}

export class SeamlessClient implements ISeamlessClient {
  constructor(public cfg: SeamlessClientConfig, public fetchFn: any) {
    this.cfg = cfg;
    this.fetchFn = fetchFn;
  }

  query(name: string, queryObject: SeamlessQuery) {
    const seamlessUrl = '';

    return fetchJSON(this.fetchFn, 'POST', seamlessUrl, {
      name,
      query: queryObject.sql,
      values: queryObject.values,
    }, {
      headers: {
        'Authorization': 'Bearer ' + this.cfg.apiKey,
      }
    });
  }
}

