import util from 'node:util';
import {exec} from 'child_process';
import pLimit from 'p-limit';

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

export async function processPromisesWithLimit<T>(
  items: Array<T>,
  promisesLimit: number,
  fn: (item: T) => Promise<T>
): Promise<T[]> {
  const limit = pLimit(promisesLimit ?? 10);
  return await Promise.all(items.map(item => limit(() => fn(item))));
}
