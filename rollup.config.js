const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const babel = require('rollup-plugin-babel');

const plugins = [];

plugins.push(nodeResolve());
plugins.push(replace({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
}));
plugins.push(babel());


export default {
  input: 'src/js/stage-fright.js',
  plugins,

  output: {
    format: 'esm',
    sourcemap: true,
    dir: 'docs/js',
  },

  experimentalCodeSplitting: true,
};
