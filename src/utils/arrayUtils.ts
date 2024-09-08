import {ProgramOptions} from '../index.ts';
import {PublishedVersion} from './npmUtils.ts';

export const getDisplayed = <T>(array: T[], options: ProgramOptions): T[] => {
  if (options.display === 'all') {
    return array;
  }

  return array.slice(0, parseInt(options.display));
};

export const filterPublishedVersions = (
  array: PublishedVersion[],
  options: ProgramOptions
): PublishedVersion[] => {
  if (options.excludePrerelease) {
    return array.filter(item => Array.isArray(item.prerelease) && item.prerelease.length == 0);
  }

  return array;
};
