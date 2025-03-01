import {ProgramOptions} from '../index.ts';
import {PublishedVersion} from './npmUtils.ts';
import {compare} from 'semver';

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

type VersionWithDate = Pick<PublishedVersion, 'publishDate' | 'version'>;

export const sortByPublishedDateThenVersion = <T extends VersionWithDate>(
  publishedVersions: T[]
): T[] => {
  return publishedVersions.sort((a, b) => {
    const diff = b.publishDate.getTime() - a.publishDate.getTime();
    if (diff === 0) {
      return compare(b.version, a.version);
    } else {
      return diff;
    }
  });
};
