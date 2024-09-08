import {ProgramOptions} from '../index.ts';
import {filterPublishedVersions, getDisplayed} from './arrayUtils.ts';
import {formatDate, getRelativeTimeDescription} from './timeUtils.ts';
import Table, {EmptySkeleton} from '../components/Table.tsx';
import {
  getInstalledPackagesInCurrentDirectory,
  getPackagesPublishedVersionsFromNPM,
  PublishedVersion
} from './npmUtils.ts';
import {render, Box, Text} from 'ink';
import {batchProcessPromises, execPromise} from './promiseUtils.ts';
import Spinner from 'ink-spinner';

export const renderPackagesRecentlyPublishedVersions = async (
  packageName: string,
  options: ProgramOptions
) => {
  const allPublishedVersions: PublishedVersion[] =
    await getPackagesPublishedVersionsFromNPM(packageName);

  const filteredPublishedVersions = filterPublishedVersions(allPublishedVersions, options);

  const versionsSortedByPublishDate = filteredPublishedVersions.sort(
    (a, b) => b.publishedDate.getTime() - a.publishedDate.getTime()
  );

  const displayedVersions = getDisplayed(versionsSortedByPublishDate, options);

  const tableData = displayedVersions?.map(({version, publishedDate}) => ({
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

export const renderInstalledPackageVersionsRecentlyPublished = async (options: ProgramOptions) => {
  const installedPackages = await getInstalledPackagesInCurrentDirectory();

  render(
    <Text>
      <Text color='green'>
        <Spinner type='dots' />
      </Text>
      {' Fetching metadata for packages...'}
    </Text>
  );

  const results = await batchProcessPromises(installedPackages, 100, ({name, version}) => {
    return execPromise(`npm view ${name} time'[${version}]'`);
  });

  const finalResults = results.map(({stdout}) => {
    return stdout.replace(/[\n\r]/g, '');
  });

  const versions = installedPackages?.map((item, index) => {
    item.publishedDate = new Date(finalResults[index]);
    return item;
  });

  const versionsSortedByPublishDate = versions.sort(
    (a, b) => b.publishedDate.getTime() - a.publishedDate.getTime()
  );

  const displayedVersions = getDisplayed(versionsSortedByPublishDate, options);

  const tableData = displayedVersions?.map(({name, version, publishedDate}) => ({
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
