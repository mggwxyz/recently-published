import {ProgramOptions} from '../index.ts';
import {
  filterPublishedVersions,
  getDisplayed,
  sortByPublishedDateThenVersion
} from './arrayUtils.ts';
import {formatDate, getRelativeTimeDescription} from './timeUtils.ts';
import Table, {EmptySkeleton} from '../components/Table.tsx';
import {
  getInstalledPackagesInCurrentDirectory,
  getPackagesPublishedVersionsFromNPM,
  PublishedVersion
} from './npmUtils.ts';
import {render, Box, Text, useApp} from 'ink';
import {batchProcessPromises, execPromise, processPromisesWithLimit} from './promiseUtils.ts';
import Spinner from 'ink-spinner';
import {useEffect, useState} from 'react';
import pLimit from 'p-limit';

export const renderPackagesRecentlyPublishedVersions = async (
  packageName: string,
  options: ProgramOptions
) => {
  const allPublishedVersions: PublishedVersion[] =
    await getPackagesPublishedVersionsFromNPM(packageName);

  const filteredPublishedVersions = filterPublishedVersions(allPublishedVersions, options);

  const versionsSortedByPublishDate = sortByPublishedDateThenVersion(filteredPublishedVersions);

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

  const {unmount, clear} = render(
    <Text>
      <Text color='green'>
        <Spinner type='dots' />
      </Text>
      {' Fetching metadata for packages...'}
    </Text>,
    {stdout: process.stderr}
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

  const versionsSortedByPublishDate = sortByPublishedDateThenVersion(versions);

  const displayedVersions = getDisplayed(versionsSortedByPublishDate, options).map(
    ({name, version, publishDate}) => ({
      name,
      version,
      publishDate,
      relativePublishDate: getRelativeTimeDescription(publishDate),
      formattedPublishDate: formatDate(publishDate)
    })
  );

  clear();
  unmount();

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

const Loading = ({count, total}: {count: number; total: number}) => {
  return (
    <Text>
      <Text color='green'>
        <Spinner type='dots' />
      </Text>
      {` ${total === 0 ? 'Fetching metadata for packages...' : `Fetched metadata for ${count} of ${total} packages...`}`}
    </Text>
  );
};

const App = ({options}: {options: ProgramOptions}) => {
  const [packages, setPackages] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);

  const {exit} = useApp();

  useEffect(() => {
    const getPackageVersions = async () => {
      const installedPackages = await getInstalledPackagesInCurrentDirectory();
      setPackages(installedPackages);

      const limit = pLimit(25);

      const results = await processPromisesWithLimit(installedPackages, 50, ({name, version}) => {
        return execPromise(`npm view ${name} time'[${version}]'`).then(result => {
          setCount(prev => prev + 1);
          return result;
        });
      });

      const finalResults = results.map(({stdout}) => {
        return stdout.replace(/[\n\r]/g, '');
      });

      const versions = installedPackages?.map((item, index) => {
        item.publishDate = new Date(finalResults[index]);
        return item;
      });

      const versionsSortedByPublishDate = sortByPublishedDateThenVersion(versions);

      const displayedVersions = getDisplayed(versionsSortedByPublishDate, options).map(
        ({name, version, publishDate}) => ({
          name,
          version,
          publishDate,
          relativePublishDate: getRelativeTimeDescription(publishDate),
          formattedPublishDate: formatDate(publishDate)
        })
      );

      const data = displayedVersions?.map(
        ({name, version, relativePublishDate, formattedPublishDate}) => ({
          Name: name,
          Version: version,
          Published: relativePublishDate,
          Date: formattedPublishDate
        })
      );

      setIsLoading(false);
      setTableData(data);

      setTimeout(() => {
        exit();
      }, 2000);
    };

    getPackageVersions();
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading total={packages.length} count={count} />
      ) : (
        <Table data={tableData} skeleton={EmptySkeleton} />
      )}
    </>
  );
};

export const renderApp = (options: ProgramOptions) => {
  render(
    <>
      <App options={options} />
    </>
  );
};
