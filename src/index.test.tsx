import {expect, test} from 'bun:test';
import {validatePackage} from './index.tsx';

test('validatePackage throws error when undefined is provided', () => {
  expect(validatePackage(undefined)).toThrow();
});
