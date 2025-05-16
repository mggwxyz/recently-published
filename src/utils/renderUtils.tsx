import {ProgramOptions} from '../index.ts';
import {render, Box, Text, useApp, Spacer} from 'ink';
import {useEffect} from 'react';
import {Loader} from '../components/Loader.tsx';
import Table, {EmptySkeleton} from '../components/Table.tsx';
import {useAppStore} from '../store/store.ts';

const App = ({options, optionalPackageName}: {options: ProgramOptions, optionalPackageName: string | null}) => {
  const {packages, count, isLoading, tableData, fetchPackages, fetchPackageVersions} = useAppStore(state => state);

  const {exit} = useApp();

  useEffect(() => {
    const fetchData = async () => {
      if (optionalPackageName) {
        await fetchPackageVersions(optionalPackageName, options);
      } else {
        await fetchPackages(options);
      }
      setTimeout(() => {
        exit();
      }, 200);
    };

    fetchData();
  }, [optionalPackageName, options]);

  if(options.json && !isLoading) {
    return <></>;
  }

  return (
    <>
      {isLoading ? (
        <Loader total={packages.length} count={count} />
      ) : (
        <Box flexDirection='column'>
          {optionalPackageName && (
            <>
              <Box flexDirection='column'>
                <Text color={'green'}> {optionalPackageName}</Text>
                </Box>
                <Spacer />
            </>
          )}
          <Table data={tableData} skeleton={EmptySkeleton} />
        </Box>
      )}
    </>
  );
};

export const renderApp = (options: ProgramOptions, optionalPackageName: string | null) => 
  render(
      <App options={options} optionalPackageName={optionalPackageName} />
  );
