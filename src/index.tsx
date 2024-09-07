#!/usr/bin/env node

import {exec} from 'child_process';
import yargs from 'yargs/yargs';
import {hideBin} from 'yargs/helpers';
import semverParse from 'semver/functions/parse.js';

import {render, Text, Box} from 'ink';
import Table, {EmptySkeleton} from './Table.tsx';
import {getRelativeTimeDescription} from './timeUtil.ts';

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

async function run() {
  const argv = await yargs(hideBin(process.argv)).argv;

  const packageName = argv._[0];

  if (!packageName) {
    console.error('Please provide a package name');
    process.exit(1);
  }

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
}

run();
