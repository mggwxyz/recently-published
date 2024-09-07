import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  splitting: false,
  sourcemap: true,
  dts: true,
  minify: true,
  clean: true,
  format: ['cjs', 'esm']
});
