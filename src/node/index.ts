import { SeamlessClient } from '../shared/SeamlessClient';
import type { SeamlessClientConfig } from '../shared/SeamlessClient';
import fetch from 'node-fetch';
import sqlTemplate from 'sql-template-strings';

export function createClient(cfg: SeamlessClientConfig) {
  return new SeamlessClient(cfg, fetch);
}

export const sql = sqlTemplate;
