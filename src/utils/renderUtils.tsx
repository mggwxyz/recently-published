import {ProgramOptions} from '../index.ts';
import {render, Box, Text, useApp, Spacer, useStdout} from 'ink';
import {useEffect} from 'react';
import {Loader} from '../components/Loader.tsx';
import Table, {EmptySkeleton} from '../components/Table.tsx';
import {useAppStore} from '../store/store.ts';

const LoadingView = ({
  options,
  optionalPackageName
}: {
  options: ProgramOptions;
  optionalPackageName: string | null;
}) => {
  const {
    packages,
    count,
    isLoading,
    fetchVersionsForAllNodeModules,
    fetchVersionsForSpecificPackage
  } = useAppStore(state => state);

  const {exit} = useApp();

  useEffect(() => {
    const fetchData = async () => {
      if (optionalPackageName) {
        await fetchVersionsForSpecificPackage(optionalPackageName, options);
      } else {
        await fetchVersionsForAllNodeModules(options);
      }
      setTimeout(() => {
        exit();
      }, 200);
    };

    fetchData();
  }, [optionalPackageName, options]);

  return <>{isLoading && <Loader total={packages.length} count={count} />}</>;
};

const ResultView = ({
  options,
  optionalPackageName
}: {
  options: ProgramOptions;
  optionalPackageName: string | null;
}) => {
  const {isLoading, tableData} = useAppStore(state => state);

  const {write} = useStdout();

  if (options.json && !isLoading) {
    write(JSON.stringify(tableData, null, 2));
    return <></>;
  }

  const displayedVersions = optionalPackageName
    ? tableData?.map(({version, relativePublishDate, formattedPublishDate}) => ({
        Version: version,
        Published: relativePublishDate,
        Date: formattedPublishDate
      }))
    : tableData?.map(({name, version, relativePublishDate, formattedPublishDate}) => ({
        Name: name,
        Version: version,
        Published: relativePublishDate,
        Date: formattedPublishDate
      }));

  return (
    <>
      <Box flexDirection='column'>
        {optionalPackageName && (
          <>
            <Box flexDirection='column'>
              <Text color={'green'}>{optionalPackageName}</Text>
            </Box>
            <Spacer />
          </>
        )}
        <Table data={displayedVersions} skeleton={EmptySkeleton} />
      </Box>
    </>
  );
};

export const renderApp = async (options: ProgramOptions, optionalPackageName: string | null) => {
  const {waitUntilExit} = render(
    <LoadingView options={options} optionalPackageName={optionalPackageName} />,
    {stdout: process.stderr}
  );

  await waitUntilExit();

  const {unmount} = render(
    <ResultView options={options} optionalPackageName={optionalPackageName} />,
    {
      stdout: process.stdout
    }
  );

  unmount();
};
