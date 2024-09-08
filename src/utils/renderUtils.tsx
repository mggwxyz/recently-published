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
    (a, b) => b.publishDate.getTime() - a.publishDate.getTime()
  );

  const displayedVersions = getDisplayed(versionsSortedByPublishDate, options).map(
    ({version, publishDate}) => ({
      version,
      publishDate,
      relativePublishDate: getRelativeTimeDescription(publishDate),
      formattedPublishDate: formatDate(publishDate)
    })
  );

  if (options.json) {
    render(null);
    console.log(JSON.stringify(displayedVersions, null, 2));
    return;
  }

  const tableData = displayedVersions?.map(
    ({version, relativePublishDate, formattedPublishDate}) => ({
      Version: version,
      Published: relativePublishDate,
      Date: formattedPublishDate
    })
  );

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
    item.publishDate = new Date(finalResults[index]);
    return item;
  });

  const versionsSortedByPublishDate = versions.sort(
    (a, b) => b.publishDate.getTime() - a.publishDate.getTime()
  );

  const displayedVersions = getDisplayed(versionsSortedByPublishDate, options).map(
    ({name, version, publishDate}) => ({
      name,
      version,
      publishDate,
      relativePublishDate: getRelativeTimeDescription(publishDate),
      formattedPublishDate: formatDate(publishDate)
    })
  );

  if (options.json) {
    render(null);
    console.log(JSON.stringify(displayedVersions, null, 2));
    return;
  }

  const tableData = displayedVersions?.map(
    ({name, version, relativePublishDate, formattedPublishDate}) => ({
      Name: name,
      Version: version,
      Published: relativePublishDate,
      Date: formattedPublishDate
    })
  );

  render(
    <>
      <Table data={tableData} skeleton={EmptySkeleton} />
    </>
  );
};
