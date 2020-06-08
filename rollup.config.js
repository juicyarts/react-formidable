import path from 'path';

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

const getBabelConfig = require('./babel.config');

const { root } = path.parse(process.cwd());
const external = (id) => !id.startsWith('.') && !id.startsWith(root);
const extensions = ['.js', '.ts', '.tsx'];
const getBabelOptions = (targets) => ({
  ...getBabelConfig({ env: (env) => env === 'build' }, targets),
  extensions,
  babelHelpers: 'bundled',
});

function createESMConfig(input, output) {
  return {
    input,
    output: { file: output, format: 'esm' },
    external,
    plugins: [
      typescript(),
      babel(getBabelOptions({ node: 8 })),
      resolve({ extensions }),
    ],
  };
}

function createCommonJSConfig(input, output) {
  return {
    input,
    output: { file: output, format: 'cjs', exports: 'named' },
    external,
    plugins: [
      typescript(),
      babel(getBabelOptions({ ie: 11 })),
      resolve({ extensions }),
    ],
  };
}

function createIIFEConfig(input, output, globalName) {
  return {
    input,
    output: {
      file: output,
      format: 'iife',
      exports: 'named',
      name: globalName,
      globals: {
        react: 'React',
      },
    },
    external,
    plugins: [
      typescript(),
      babel(getBabelOptions({ ie: 11 })),
      resolve({ extensions }),
    ],
  };
}

export default [
  createESMConfig('src/index.ts', 'dist/index.js'),
  createCommonJSConfig('src/index.ts', 'dist/index.cjs.js'),
  createIIFEConfig('src/index.ts', 'dist/index.iife.js', 'reactResolve'),
];
