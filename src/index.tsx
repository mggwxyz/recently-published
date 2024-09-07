#!/usr/bin/env node

import yargs from 'yargs/yargs';
import {hideBin} from 'yargs/helpers';

import {recentlyPublishedVersions, recentlyPublishedPackages} from './npmCommands.tsx';

async function run() {
  const argv = await yargs(hideBin(process.argv)).argv;

  const packageName = argv._[0] as string;

  if (!packageName) {
    await recentlyPublishedPackages();
  } else {
    await recentlyPublishedVersions(packageName);
  }
}

run();
