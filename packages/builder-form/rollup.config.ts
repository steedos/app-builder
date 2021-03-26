import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import less from 'rollup-plugin-less';
import replace from 'rollup-plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import { uglify } from 'rollup-plugin-uglify';
const rollupPostcssLessLoader = require('rollup-plugin-postcss-webpack-alias-less-loader')
import path from 'path';

const options = {
  input: `src/builder-webcomponents.tsx`,
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [,
    // Allow json resolution
    json(),
    nodeResolve(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // less({
    //   extensions: ['.css', '.less'],
    //   inject: true,
    //   exclude: [],
    //   include: [path.resolve(__dirname, '../../node_modules/antd'), path.resolve(__dirname, '../../node_modules/@ant-design/')],
    //   option: {javascriptEnabled: true}
    // }),
    babel({
      plugins: [
        ['import', { libraryName: 'antd', style: true }],
      ],
      exclude: ['node_modules/**', 'public/**'],
    }),
    postcss({
      loaders: [rollupPostcssLessLoader({
        nodeModulePath: path.resolve('../../node_modules'),
        aliases: {
          '~': path.resolve('../../node_modules'),
        }
      })],
      use: [["less", { javascriptEnabled: true }]],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs()
  ],
};

export default [
  // React CJS
  {
    ...options,
    output: [{ file: 'dist/builder-form.react.js', format: 'cjs', sourcemap: true }],
    plugins: options.plugins.concat([sourceMaps()]),
  },
  // ES
  {
    ...options,
    output: [{ file: 'dist/builder-form.esm.js', format: 'es', sourcemap: true }],
    plugins: options.plugins.concat([sourceMaps()]),
  },
  {
    ...options,
    output: [
      {
        file: 'dist/builder-form.umd.js',
        name: 'BuilderForm',
        format: 'umd',
        sourcemap: true,
        amd: {
          id: '@steedos/builder-form',
        },
      },
    ],
    plugins: options.plugins.concat([uglify(), sourceMaps()]),
  },
];
