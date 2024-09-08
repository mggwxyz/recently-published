import util from 'node:util';
import {exec} from 'child_process';

export const execPromise = util.promisify(exec);

export async function batchProcessPromises<T>(
  items: Array<T>,
  limit: number,
  fn: (item: T) => Promise<T>
): Promise<T[]> {
  let results: T[] = [];

  for (let start = 0; start < items.length; start += limit) {
    const end = start + limit > items.length ? items.length : start + limit;

    const slicedResults = await Promise.all(items.slice(start, end).map(fn));

    results = [...results, ...slicedResults];
  }

  return results;
}
