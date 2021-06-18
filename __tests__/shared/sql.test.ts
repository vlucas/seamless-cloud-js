import { sql } from '../../src/shared/sql';

describe('sql tagged template literal', () => {
  it('should parse a query without variables', async () => {
    const name = 'two';
    const parsed = sql`SELECT * from test`;

    expect(parsed.querySql).not.toContain('$1');
    expect(Object.keys(parsed.queryVars).length).toEqual(0);
  });

  it('should parse a query with variables', async () => {
    const name = 'two';
    const parsed = sql`SELECT * from test WHERE "name" = ${name}`;

    expect(parsed.querySql).toContain('$1');
    expect(parsed.queryVars['1']).toEqual(name);
  });
});
