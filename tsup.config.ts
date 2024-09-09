import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  dts: true,
  minify: true,
  clean: true,
  format: ['cjs', 'esm']
});
