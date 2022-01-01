import { sql, sqlFormat } from '../../src/shared/sql';

describe('sql tagged template literal', () => {
  it('should parse a query without variables', async () => {
    const name = 'two';
    const parsed = sql`SELECT * from test`;

    expect(parsed.querySql).not.toContain('${1}');
    expect(Object.keys(parsed.queryVars).length).toEqual(0);
  });

  it('should parse a query with variables', async () => {
    const name = 'two';
    const parsed = sql`SELECT * from test WHERE "name" = ${name}`;

    expect(parsed.querySql).toContain('${1}');
    expect(parsed.queryVars['1']).toEqual(name);
  });

  it('should strip extra whitespace before and after query', async () => {
    const name = 'two';
    const parsed = sql`
      SELECT * from test
      WHERE "name with space" = ${name}
      LIMIT 1
    `;

    expect(parsed.querySql).toEqual('SELECT * from test WHERE "name with space" = ${1} LIMIT 1');
    expect(parsed.queryVars['1']).toEqual(name);
  });
});

describe('sqlFormat', () => {
  it('should not strip spaces inside double quotes', async () => {
    const name = 'two';
    const sql = sqlFormat(`

      SELECT * from test

      WHERE "name with   space" = :name


      LIMIT 1

    `);

    expect(sql).toEqual('SELECT * from test WHERE "name with   space" = :name LIMIT 1');
  });

  it('should not strip spaces inside single quotes', async () => {
    const name = 'two';
    const sql = sqlFormat(`
      SELECT * from test
      WHERE 'name with   space' = :name

      LIMIT 1
    `);

    expect(sql).toEqual(`SELECT * from test WHERE 'name with   space' = :name LIMIT 1`);
  });
});
