import semverParse from 'semver/functions/parse.js';
import validatePackageName from 'validate-npm-package-name';

import {execPromise} from './promiseUtils.ts';

type NPMVersionsObject = {
  [version: string]: string;
};

type NpmRegistryPackageResponse = {
  time?: Record<string, string> | undefined;
};

export type PublishedVersion = {
  name: string;
  publishDate: Date;
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

const NPM_REGISTRY_BASE_URL = 'https://registry.npmjs.org';

function encodePackageNameForRegistry(packageName: string) {
  // Scoped package names like @scope/name must be URL encoded as %40scope%2Fname
  return encodeURIComponent(packageName);
}

async function fetchNpmRegistryPackage(packageName: string): Promise<NpmRegistryPackageResponse> {
  const encoded = encodePackageNameForRegistry(packageName);
  const url = `${NPM_REGISTRY_BASE_URL}/${encoded}`;

  const res = await fetch(url, {
    headers: {
      // Keep responses small and consistent (no install scripts, etc.).
      Accept: 'application/vnd.npm.install-v1+json'
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch npm package metadata for "${packageName}" (HTTP ${res.status})`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (await res.json()) as NpmRegistryPackageResponse;
}

export const getPackagesPublishedVersionsFromNPM = async (
  packageName: string
): Promise<PublishedVersion[]> => {
  const pkg = await fetchNpmRegistryPackage(packageName);
  const versions: NPMVersionsObject | undefined = pkg.time;

  if (!versions) {
    throw new Error(`npm registry response for "${packageName}" is missing the "time" field`);
  }

  delete versions.created;
  delete versions.modified;

  return Object.entries(versions).map(([version, timestamp]) => ({
    name: packageName,
    version,
    ...semverParse(version),
    publishDate: new Date(timestamp)
  }));
};

export const getPublishedDateForPackageVersionFromNPM = async (
  packageName: string,
  version: string
): Promise<Date> => {
  const pkg = await fetchNpmRegistryPackage(packageName);
  const time = pkg.time;

  if (!time) {
    throw new Error(`npm registry response for "${packageName}" is missing the "time" field`);
  }

  const timestamp = time[version];
  if (!timestamp) {
    throw new Error(`npm registry response for "${packageName}" is missing time for version "${version}"`);
  }

  return new Date(timestamp);
};

export const getInstalledPackagesInCurrentDirectory = async (): Promise<PublishedVersion[]> => {
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
    throw new Error((error as Error).message);
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
