import {exec} from 'child_process';
import yargs from 'yargs/yargs';
import {hideBin} from 'yargs/helpers';
import semverParse from 'semver/functions/parse';

import {render, Text, Box} from 'ink';
import Table, {EmptySkeleton} from './src/Table.tsx';
import {getRelativeTimeDescription} from './src/timeUtil.ts';

const argv = await yargs(hideBin(process.argv)).argv;

const packageName = argv._[0];

if (!packageName) {
  console.error('Please provide a package name');
  process.exit(1);
}

type NPMVersionsObject = {
  [version: string]: string;
};

type PublishedVersion = {
  version: string;
  publishedDate: Date;
  [key: string]: unknown;
};

const options = {
  limit: 10,
  includePrerelease: false
};

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

    const mostRecent = versionsSortedByPublishDate.slice(0, 10);

    const tableData = mostRecent?.map(({version, publishedDate}) => ({
      Version: version,
      Published: getRelativeTimeDescription(publishedDate),
      Date: publishedDate
    }));

    render(
      <>
        <Text color={'green'}> {packageName}</Text>
        <Box height={1}></Box>
        <Table data={tableData} padding={2} skeleton={EmptySkeleton} />
      </>
    );
  } catch (parseError) {
    // @ts-expect-error This is a runtime error
    console.error(`Error parsing npm view output: ${parseError?.message}`);
  }
});
