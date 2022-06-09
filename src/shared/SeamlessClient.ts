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

export type SeamlessQueryResult = {
  meta: {
    success: boolean;
    statusCode: number;
    dtResponse: string;
  };
  data: {
    results?: any[];
    rowCount?: number;
    timeMs?: number;
  };
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

  /**
   * Find and return a single row. No result throws Error with optional custom message.
   */
  async findOneOrThrow(queryKey: string, query: SeamlessQuery, errorMsg?: string): Promise<any> {
    const response = await this.query(queryKey, query);
    const rows = response?.data?.results;

    if (!rows || rows.length === 0) {
      throw new Error(errorMsg || 'Record not found');
    }

    return rows[0];
  }

  /**
   * Find and return a single row. No result returns boolean false.
   */
  async findOne(queryKey: string, query: SeamlessQuery): Promise<any | boolean> {
    const response = await this.query(queryKey, query);
    const rows = response?.data?.results;

    if (!rows || rows.length === 0) {
      return false;
    }

    return rows[0];
  }

  /**
   * Find many rows (Always returns an array. No results = empty array)
   */
  async findMany(queryKey: string, query: SeamlessQuery): Promise<Array<any>> {
    const response = await this.query(queryKey, query);
    const rows = response?.data?.results;

    return rows || [];
  }

  /**
   * Run SQL Query
   */
  async query(queryKey: string, queryObject: SeamlessQuery): Promise<SeamlessQueryResult> {
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
      const { apiKey, ...logParams } = queryParams; // Don't log out apiKey
      console.log('[seamless-cloud query]: ', seamlessUrl, logParams);
    }

    const beforeQueryMs = Date.now();
    const results = await fetchJSON(this.fetchFn, 'POST', seamlessUrl, queryParams);
    const afterQueryMs = Date.now();

    if (this.debug) {
      console.log('[seamless-cloud timeMs]: ', results?.data?.timeMs);
      console.log('[seamless-cloud rowCount]: ', results?.data?.rowCount);
      console.log('[seamless-cloud responseTimeMs]: ', afterQueryMs - beforeQueryMs);
    }

    return results;
  }
}
