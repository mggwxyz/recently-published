import semverParse from 'semver/functions/parse.js';
import validatePackageName from 'validate-npm-package-name';

import {execPromise} from './promiseUtils.ts';

type NPMVersionsObject = {
  [version: string]: string;
};

export type PublishedVersion = {
  publishedDate: Date;
  raw?: string | undefined;
  loose?: boolean | undefined;
  options?: unknown | undefined;
  major?: number | undefined;
  minor?: number | undefined;
  patch?: number | undefined;
  version: string;
  build?: readonly string[] | undefined;
  prerelease?: readonly (string | number)[] | undefined;
};

export const getPackagesPublishedVersionsFromNPM = async (packageName: string) => {
  try {
    const {stdout} = await execPromise(`npm view ${packageName} time --json`);

    const versions: NPMVersionsObject = JSON.parse(stdout);

    delete versions.created;
    delete versions.modified;

    return Object.entries(versions).map(([version, timestamp]) => ({
      version,
      ...semverParse(version),
      publishedDate: new Date(timestamp)
    }));
  } catch (error: unknown) {
    console.error((error as Error).message);
    process.exit(1);
  }
};

export const getInstalledPackagesInCurrentDirectory = async () => {
  try {
    const {stdout} = await execPromise('npm list --json');

    const npmListResponse: {dependencies: object} = JSON.parse(stdout);

    if (!npmListResponse.dependencies) {
      throw new Error('No installed packages found in this directory');
    }

    return Object.entries(npmListResponse.dependencies).map(([name, details]) => ({
      name,
      ...details
    }));
  } catch (error: unknown) {
    console.error((error as Error).message);
    process.exit(1);
  }
};

// Function to validate package name input (including scopes)
export const validatePackageInput = (input: string | undefined): boolean => {
  // Allow undefined (optional argument)
  if (input === undefined) return true;

  // Validate the package name
  const packageNameValidation = validatePackageName(input);
  if (!packageNameValidation.validForNewPackages && !packageNameValidation.validForOldPackages) {
    return false; // Invalid package name
  }

  return true; // Valid package name and version
};
