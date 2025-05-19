import {createStore} from 'zustand/vanilla';
import {useStore} from 'zustand';

import {execPromise, processPromisesWithLimit} from '../utils/promiseUtils.ts';
import {formatDate, getRelativeTimeDescription} from '../utils/timeUtils.ts';

import {
  filterPublishedVersions,
  getDisplayed,
  sortByPublishedDateThenVersion
} from '../utils/arrayUtils.ts';

import {
  getInstalledPackagesInCurrentDirectory,
  getPackagesPublishedVersionsFromNPM
} from '../utils/npmUtils.ts';
import {ProgramOptions} from '../index.ts';

type State = {
  packages: PackageVersionRowData[];
  count: number;
  isLoading: boolean;
  tableData: PackageVersionRowData[];
  packageName: string | null;
};

type Action = {
  setPackages: (newPackages: PackageVersionRowData[]) => void;
  setCount: (newCount: number) => void;
  setIsLoading: (newIsLoading: boolean) => void;
  setTableData: (newTableData: PackageVersionRowData[]) => void;
  setPackageName: (name: string | null) => void;
  fetchVersionsForAllNodeModules: (options: ProgramOptions) => Promise<void>;
  fetchVersionsForSpecificPackage: (packageName: string, options: ProgramOptions) => Promise<void>;
};

export type PackageVersionRowData = {
  name: string;
  version: string;
  relativePublishDate: string;
  formattedPublishDate: string;
};

export const appStore = createStore<State & Action>((set, get) => ({
  packages: [],
  count: 0,
  isLoading: true,
  tableData: [],
  packageName: null,
  setPackages: newPackages => set({packages: newPackages}),
  setCount: newCount => set({count: newCount}),
  setIsLoading: newIsLoading => set({isLoading: newIsLoading}),
  setTableData: newTableData => set({tableData: newTableData}),
  setPackageName: name => set({packageName: name}),
  fetchVersionsForAllNodeModules: async (options: ProgramOptions) => {
    const installedPackages = await getInstalledPackagesInCurrentDirectory();

    get().setPackages(installedPackages);

    const results = await processPromisesWithLimit(
      installedPackages,
      100,
      async ({name, version}) => {
        const result = await execPromise(`npm view ${name} time'[${version}]'`);
        get().setCount(get().count + 1);
        return result;
      }
    );

    const finalResults = results.map(({stdout}) => {
      return stdout.replace(/[\n\r]/g, '');
    });

    const versions = installedPackages?.map((item, index) => {
      item.publishDate = new Date(finalResults[index]);
      return item;
    });

    const versionsSortedByPublishDate = sortByPublishedDateThenVersion(versions);

    const displayedVersions = getDisplayed(versionsSortedByPublishDate, options).map(
      ({name, version, publishDate}) => ({
        name,
        version,
        publishDate,
        relativePublishDate: getRelativeTimeDescription(publishDate),
        formattedPublishDate: formatDate(publishDate)
      })
    );

    get().setIsLoading(false);
    get().setTableData(displayedVersions);
  },
  fetchVersionsForSpecificPackage: async (packageName: string, options: ProgramOptions) => {
    get().setPackageName(packageName);
    get().setIsLoading(true);
    get().setCount(0);

    const allPublishedVersions = await getPackagesPublishedVersionsFromNPM(packageName);
    const filteredPublishedVersions = filterPublishedVersions(allPublishedVersions, options);
    const versionsSortedByPublishDate = sortByPublishedDateThenVersion(filteredPublishedVersions);

    const displayedVersions = getDisplayed(versionsSortedByPublishDate, options).map(
      ({version, publishDate}) => ({
        version,
        publishDate,
        relativePublishDate: getRelativeTimeDescription(publishDate),
        formattedPublishDate: formatDate(publishDate)
      })
    );

    get().setIsLoading(false);
    get().setTableData(displayedVersions);
  }
}));

export const useAppStore = (selector: (state: State & Action) => State & Action) =>
  useStore(appStore, selector);
