// rollup.config.mjs
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser'; // Import terser

import { readFileSync } from 'node:fs';
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

export default [
  {
    input: 'src/index.tsx', // Assumes your main source file is index.tsx. If it's index.ts, change this line.
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
      }),
      terser({
        compress: {
          drop_console: true, // Remove console.log statements
          drop_debugger: true, // Remove debugger statements
        },
        mangle: {
          toplevel: true, // Mangle top-level variable names (usually good for libraries)
        },
        output: {
          comments: false, // Remove all comments
        },
      }),
    ],
    external: ['react', 'react-dom'],
  },
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: pkg.types, format: 'es' }],
    plugins: [dts()],
  },
];