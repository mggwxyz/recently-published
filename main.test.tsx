import { expect, test } from "bun:test";
import {validatePackage} from './main.tsx';

test("validatePackage throws error when undefined is provided", () => {
  expect(validatePackage(undefined)).toThrow();
});
