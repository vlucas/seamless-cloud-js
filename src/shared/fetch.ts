import deepmerge from 'deepmerge';
import qs from 'querystringify';

type HttpRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

/**
 * Generic fetch JSON method that handles errors (non-sucessful response codes)
 */
export async function fetchJSON(
  fetchFn: any,
  method: HttpRequestMethod,
  url: string,
  body: object,
  fetchOptions: any = {}
) {
  const fetchOptionDefaults = {
    mode: 'cors',
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'Seamless.cloud NPM Client',
    },
  };

  fetchOptions = deepmerge(fetchOptionDefaults, fetchOptions);
  fetchOptions.method = method.toUpperCase();

  if (body && typeof body === 'object') {
    if (fetchOptions.method === 'GET') {
      url = `${url}?${qs.stringify(body)}`;
    } else {
      fetchOptions.body = JSON.stringify(body);
    }
  }

  const res = await fetchFn(url, fetchOptions);
  const json = await res.json();
  const statusCode = res.status;

  // Check response to ensure everything is OK...
  if (statusCode >= 400) {
    const err = new Error(
      json.meta?.message || json.error_message || json.message || 'Internal Server Error'
    );

    // @ts-ignore
    err.json = json;
    // @ts-ignore
    err.number = json.meta?.statusCode || statusCode || 400;

    if (json.meta?.errorType == 'duplicate') {
      // @ts-ignore
      err.number = 400;
    }

    throw err;
  }

  return json;
}
