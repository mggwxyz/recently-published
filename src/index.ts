#!/usr/bin/env node

import {Command} from 'commander';
import * as pkg from '../package.json';

import {validatePackageInput} from './utils/npmUtils.ts';
import {
  renderInstalledPackageVersionsRecentlyPublished,
  renderPackagesRecentlyPublishedVersions
} from './utils/renderUtils.tsx';

const program = new Command();

export type ProgramOptions = {
  display: string;
  excludePrerelease: boolean;
  json: boolean;
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
  .option('--json', 'Output the result in JSON format')
  .action(async (optionalPackageName: string, options: ProgramOptions) => {
    if (!validatePackageInput(optionalPackageName)) {
      console.error(
        'Invalid input. Please provide a valid npm package name (including scope). Versions ranges are not supported.'
      );
      process.exit(1); // Exit with an error code
    }

    if (!optionalPackageName) {
      await renderInstalledPackageVersionsRecentlyPublished(options);
    } else {
      await renderPackagesRecentlyPublishedVersions(optionalPackageName, options);
    }
  });

program.parse(process.argv);
