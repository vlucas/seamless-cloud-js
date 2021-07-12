# Seamless.cloud JS Client

This JS client is for Node.js and is currently SERVER-SIDE ONLY.

PLEASE don't use this client-side. You don't want to leak your API key and let any rando run SQL queries against your
database...

## Install

Install with NPM or Yarn:

```javascript
npm i seamless-cloud
```

## Usage

You must initialize the `SeamlessClient` class with a `SeamlessClientConfig` object, and a `fetch` function to use.
Specifying this function yourself keeps this client portable across server and client applications.

```javascript
import { SeamlessClient, sql } from 'seamless-cloud';

const client = new SeamlessClient(
  {
    account: 'accountUsername',
    project: 'project-name',
    apiKey: 'my-api-key-here',
  },
  fetch
);
```

Once initialized, you can now run queries using the `sql` helper (imported from `seamless-cloud`):

```javascript
const authorId = 1;
const results = await client.query(sql`SELECT * FROM posts WHERE authorId = ${authorId} LIMIT 20`);
```
