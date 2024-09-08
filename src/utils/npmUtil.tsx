import {Box, render, Text} from 'ink';
import semverParse from 'semver/functions/parse.js';
import {formatDate, getRelativeTimeDescription} from './timeUtils.ts';
import Table, {EmptySkeleton} from '../components/Table.tsx';
import {batchProcessPromises, execPromise} from './promiseUtils.ts';
import Spinner from 'ink-spinner';

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
  const {stdout} = await execPromise(`npm view ${packageName} time --json`);

  const versions: NPMVersionsObject = JSON.parse(stdout);

  delete versions.created;
  delete versions.modified;

  const versionsSortedByPublishDate: PublishedVersion[] = Object.entries(versions)
    .map(([version, timestamp]) => ({
      version,
      ...semverParse(version),
      publishedDate: new Date(timestamp)
    }))
    .sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());

  const mostRecent = versionsSortedByPublishDate.slice(0, 5);

  const tableData = mostRecent?.map(({version, publishedDate}) => ({
    Version: version,
    Published: getRelativeTimeDescription(publishedDate),
    Date: formatDate(publishedDate)
  }));

  render(
    <>
      <Box>
        <Text color={'green'}> {packageName}</Text>
      </Box>

      <Table data={tableData} skeleton={EmptySkeleton} />
    </>
  );
};

export const recentlyPublishedPackages = async () => {
  const {stdout} = await execPromise('npm list --json');

  const npmListResponse: {dependencies: object} = JSON.parse(stdout);

  if (!npmListResponse.dependencies) {
    throw new Error('No installed packages found in this directory');
  }

  const items = Object.entries(npmListResponse.dependencies).map(([name, details]) => ({
    name,
    ...details
  }));

  render(
    <Text>
      <Text color='green'>
        <Spinner type='dots' />
      </Text>
      {' Fetching metadata for packages...'}
    </Text>
  );

  const results = await batchProcessPromises(items, 100, ({name, version}) => {
    return execPromise(`npm view ${name} time'[${version}]'`);
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

  render(
    <>
      <Table data={tableData} skeleton={EmptySkeleton} />
    </>
  );
};
