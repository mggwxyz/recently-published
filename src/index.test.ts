import {describe, it, expect} from 'vitest';
import {execa} from 'execa';

import mockDataForDeprecatedRequestPackage from './test-data/test-package-versions.json';

type Data = {
  version: string;
  publishDate: string;
};

function extractVersionAndPublishDate(data: Data[]) {
  return data.map(({version, publishDate}) => ({
    version,
    publishDate
  }));
}

describe('CLI Tool Tests', () => {
  it('should return correct data for "recently-published request --display=all --json', async () => {
    const {stdout} = await execa('tsx', ['./src/index.ts', 'request', '--display=all', '--json']);
    const result = JSON.parse(stdout);
    expect(extractVersionAndPublishDate(result)).toEqual(
      extractVersionAndPublishDate(mockDataForDeprecatedRequestPackage)
    );
  });

  it('should return correct data for "recently-published request --json', async () => {
    const {stdout} = await execa('tsx', ['./src/index.ts', 'request', '--json']);
    const result = JSON.parse(stdout);
    expect(extractVersionAndPublishDate(result)).toEqual(
      extractVersionAndPublishDate(mockDataForDeprecatedRequestPackage.slice(0, 5))
    );
  });

  it('should return correct data for "recently-published request --display=1', async () => {
    const {stdout} = await execa('tsx', ['./src/index.ts', 'request', '--display=1', '--json']);
    const result = JSON.parse(stdout);
    expect(extractVersionAndPublishDate(result)).toEqual(
      extractVersionAndPublishDate(mockDataForDeprecatedRequestPackage.slice(0, 1))
    );
  });
});
