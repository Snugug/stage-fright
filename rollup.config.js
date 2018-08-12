const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const minify = require('rollup-plugin-babel-minify');

const plugins = [];

plugins.push(nodeResolve());
plugins.push(replace({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
}));

if (process.env.NODE_ENV === 'production') {
  plugins.push(minify({
    comments: false,
  }));
}

export default {
  input: 'src/js/stage-fright.js',
  plugins,

  output: {
    format: 'es',
    sourcemap: true,
    file: 'docs/js/stage-fright.js',
  },
};
