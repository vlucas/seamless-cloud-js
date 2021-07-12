import nock from 'nock';
import fetch from 'node-fetch';
import { SeamlessClient, sql } from '../src/index';

describe('Server Side Queries', () => {
  const client = new SeamlessClient(
    {
      account: 'vlucas',
      project: 'seamless-cloud-js',
      apiKey: 'test-api-key-here',
    },
    fetch
  );

  it('should run a basic query', async () => {
    const mock = nock('https://us-east-2.sqlapi.seamless.cloud')
      .post('/sqlapi')
      .reply(200, {
        data: {
          results: [
            {
              time: '2021-06-18T14:14:31.929Z',
            },
          ],
          rowCount: 1,
          timeMs: 15,
        },
        meta: {
          dtResponse: '2021-06-18T14:14:31.928Z',
          statusCode: 200,
          success: true,
        },
      });

    const result = await client.query('__test_select_time__', sql`SELECT now() AS time_now`);

    expect(result.data.results[0].time).not.toBeNull();
  });

  it('should run a query with variables', async () => {
    const mock = nock('https://us-east-2.sqlapi.seamless.cloud')
      .post('/sqlapi')
      .reply(200, {
        data: {
          results: [
            {
              dtCreated: '2021-06-17T23:04:48.985Z',
              id: 2,
              name: 'two',
            },
          ],
          rowCount: 1,
          timeMs: 13,
        },
        meta: {
          dtResponse: '2021-06-18T14:15:17.720Z',
          statusCode: 200,
          success: true,
        },
      });

    const name = 'two';
    const result = await client.query(
      '__test_withvars__',
      sql`SELECT * from test WHERE "name" = ${name}`
    );

    expect(result.data.results[0].name).toEqual(name);
  });
});
