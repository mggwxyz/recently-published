import {describe, expect, it} from 'vitest';
import {http, HttpResponse} from 'msw';

import {server} from './test/msw/server.ts';
import {
  getPackagesPublishedVersionsFromNPM,
  getPublishedDateForPackageVersionFromNPM
} from './utils/npmUtils.ts';

describe('npm registry lookups (MSW)', () => {
  it('fetches versions + publish dates from registry "time"', async () => {
    server.use(
      http.get('https://registry.npmjs.org/request', () => {
        return HttpResponse.json({
          time: {
            created: '2010-01-01T00:00:00.000Z',
            modified: '2012-01-01T00:00:00.000Z',
            '1.0.0': '2011-01-01T00:00:00.000Z',
            '2.0.0': '2011-02-01T00:00:00.000Z'
          }
        });
      })
    );

    const versions = await getPackagesPublishedVersionsFromNPM('request');
    expect(versions.map(v => ({name: v.name, version: v.version}))).toEqual([
      {name: 'request', version: '1.0.0'},
      {name: 'request', version: '2.0.0'}
    ]);
    expect(versions[0]?.publishDate.toISOString()).toBe('2011-01-01T00:00:00.000Z');
  });

  it('URL-encodes scoped package names', async () => {
    server.use(
      http.get('https://registry.npmjs.org/%40types%2Fnode', () => {
        return HttpResponse.json({
          time: {
            created: '2020-01-01T00:00:00.000Z',
            modified: '2020-01-02T00:00:00.000Z',
            '1.0.0': '2020-01-02T12:00:00.000Z'
          }
        });
      })
    );

    const versions = await getPackagesPublishedVersionsFromNPM('@types/node');
    expect(versions).toHaveLength(1);
    expect(versions[0]?.name).toBe('@types/node');
    expect(versions[0]?.version).toBe('1.0.0');
  });

  it('throws a helpful error for 404 (package not found)', async () => {
    server.use(
      http.get('https://registry.npmjs.org/does-not-exist', () => {
        return new HttpResponse(null, {status: 404});
      })
    );

    await expect(getPackagesPublishedVersionsFromNPM('does-not-exist')).rejects.toThrow(
      /HTTP 404/
    );
  });

  it('throws a helpful error for 429 (rate limited)', async () => {
    server.use(
      http.get('https://registry.npmjs.org/rate-limited', () => {
        return new HttpResponse(null, {status: 429});
      })
    );

    await expect(getPackagesPublishedVersionsFromNPM('rate-limited')).rejects.toThrow(/HTTP 429/);
  });

  it('throws if registry response is missing "time"', async () => {
    server.use(
      http.get('https://registry.npmjs.org/missing-time', () => {
        return HttpResponse.json({name: 'missing-time'});
      })
    );

    await expect(getPackagesPublishedVersionsFromNPM('missing-time')).rejects.toThrow(
      /missing the "time" field/
    );
  });

  it('can fetch publish date for a single package version', async () => {
    server.use(
      http.get('https://registry.npmjs.org/request', () => {
        return HttpResponse.json({
          time: {
            created: '2010-01-01T00:00:00.000Z',
            modified: '2012-01-01T00:00:00.000Z',
            '2.0.0': '2011-02-01T00:00:00.000Z'
          }
        });
      })
    );

    const date = await getPublishedDateForPackageVersionFromNPM('request', '2.0.0');
    expect(date.toISOString()).toBe('2011-02-01T00:00:00.000Z');
  });

  it('throws if the requested version does not exist in "time"', async () => {
    server.use(
      http.get('https://registry.npmjs.org/request', () => {
        return HttpResponse.json({
          time: {
            created: '2010-01-01T00:00:00.000Z',
            modified: '2012-01-01T00:00:00.000Z',
            '1.0.0': '2011-01-01T00:00:00.000Z'
          }
        });
      })
    );

    await expect(getPublishedDateForPackageVersionFromNPM('request', '9.9.9')).rejects.toThrow(
      /missing time for version "9\.9\.9"/
    );
  });
});
