import {Box, render, Text} from 'ink';
import {exec} from 'child_process';
import semverParse from 'semver/functions/parse.js';
import {formatDate, getRelativeTimeDescription} from './timeUtil.ts';
import Table, {EmptySkeleton} from './Table.tsx';

import util from 'node:util';
const execP = util.promisify(exec);

type NPMVersionsObject = {
  [version: string]: string;
};

type PublishedVersion = {
  version: string;
  publishedDate: Date;
  [key: string]: unknown;
};

const options = {
  limit: 5,
  includePrerelease: false
};

export const recentlyPublishedVersions = async (packageName: string) => {
  // Execute the npm view command to fetch package versions
  exec(`npm view ${packageName} time --json`, (error, stdout) => {
    if (error) {
      console.error(`Error executing npm view: ${error.message}`);
      return;
    }

    try {
      const versions: NPMVersionsObject = JSON.parse(stdout);

      delete versions.created;
      delete versions.modified;

      const versionsSortedByPublishDate: PublishedVersion[] = Object.entries(versions)
        .map(([version, timestamp]) => ({
          version,
          ...semverParse(version),
          publishedDate: new Date(timestamp)
        }))
        .filter(({prerelease}) => {
          if (options.includePrerelease) {
            return true;
          }
          if (prerelease?.length ?? 0 > 0) {
            return false;
          }

          return true;
        })
        .sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());

      const mostRecent = versionsSortedByPublishDate.slice(0, 5);

      const tableData = mostRecent?.map(({version, publishedDate}) => ({
        Version: version,
        Published: getRelativeTimeDescription(publishedDate),
        Date: formatDate(publishedDate)
      }));

      const padding = 1;

      render(
        <>
          <Box>
            <Text color={'green'}>
              {Array(padding).fill(' ').join('')}
              {packageName}
            </Text>
          </Box>
          {/* @ts-expect-error ignoring for now */}
          <Table data={tableData} padding={padding} skeleton={EmptySkeleton} />
        </>
      );
    } catch (parseError) {
      // @ts-expect-error This is a runtime error
      console.error(`Error parsing npm view output: ${parseError?.message}`);
    }
  });
};

export const recentlyPublishedPackages = async () => {
  const {stdout} = await execP('npm list --json');

  const object: any = JSON.parse(stdout);

  const items = Object.entries(object.dependencies).map(([name, details]) => ({
    name,
    ...details
  }));

  const results = await processPromisesBatch(items, 100, ({name, version}) => {
    return execP(`npm view ${name} time'[${version}]'`);
  });

  const finalResults = results.map(({stdout}) => {
    return stdout.replace(/[\n\r]/g, '');
  });

  const sortedItems = items
    ?.map((item, index) => {
      item.publishedDate = new Date(finalResults[index]);
      return item;
    })
    .sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());

  const mostRecent = sortedItems.slice(0, 5);

  const tableData = mostRecent?.map(({name, version, publishedDate}) => ({
    Name: name,
    Version: version,
    Published: getRelativeTimeDescription(publishedDate),
    Date: formatDate(publishedDate)
  }));

  const padding = 1;

  render(
    <>
      {/* @ts-expect-error ignoring for now */}
      <Table data={tableData} skeleton={EmptySkeleton} />
    </>
  );
};

export async function processPromisesBatch(
  items: Array<any>,
  limit: number,
  fn: (item: any) => Promise<any>
): Promise<any> {
  let results = [];
  for (let start = 0; start < items.length; start += limit) {
    const end = start + limit > items.length ? items.length : start + limit;

    const slicedResults = await Promise.all(items.slice(start, end).map(fn));

    results = [...results, ...slicedResults];
  }

  return results;
}
