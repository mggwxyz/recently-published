#!/usr/bin/env node

import {Command} from 'commander';
import * as pkg from '../package.json';

import {recentlyPublishedVersions, recentlyPublishedPackages} from './utils/npmUtil.tsx';

const program = new Command();

export type ProgramOptions = {
  display: string;
  excludePrerelease: boolean;
};

program
  .name(pkg.name)
  .version(pkg.version)
  .argument(
    '[optionalPackageName]',
    'Optional package name whose recently published versions you want to see. If not provided, will display recently published packages installed in the current directory.'
  )
  .option(
    '-d, --display <number>',
    'Number of recently published versions you would like displayed or "all" if you want to display all of them',
    '5'
  )
  .option(
    '-ep, --excludePrerelease',
    'Exclude prerelease versions from the list of recently published versions'
  )
  .action(async (optionalPackageName: string, options: ProgramOptions) => {
    if (!optionalPackageName) {
      await recentlyPublishedPackages(options);
    } else {
      await recentlyPublishedVersions(optionalPackageName, options);
    }
  });

program.parse(process.argv);
