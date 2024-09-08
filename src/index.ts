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
  .argument('packageName', 'Package whose recently published versions you want to see')
  .option(
    '-d, --display <number>',
    '# of recently published versions you would like displayed or "all" if you want to display all of them',
    '5'
  )
  .option(
    '-ep, --excludePrerelease',
    'Exclude prerelease versions from the list of recently published versions'
  )
  .action(async (packageName: string, options: ProgramOptions) => {
    if (!packageName) {
      await recentlyPublishedPackages(options);
    } else {
      await recentlyPublishedVersions(packageName, options);
    }
  });

program.parse(process.argv);
