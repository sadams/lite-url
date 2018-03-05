/* eslint-disable import/no-extraneous-dependencies */
const { rollup } = require('rollup');
const uglify = require('rollup-plugin-uglify');
const license = require('rollup-plugin-license');

const plugins = [
  license({
    banner: `@version v<%= pkg.version %> (${(new Date()).toUTCString()})
@link <%= pkg.repository.url %>
@license <%= pkg.license %>`
  })
];

// Regular bundle
rollup({
  input: 'src/lite-url.js',
  plugins
}).then((bundle) => {
  bundle.write({
    format: 'iife',
    name: 'liteURL',
    file: 'dist/lite-url.globals.js'
  });
  bundle.write({
    format: 'cjs',
    file: 'dist/lite-url.cjs.js'
  });
});

// Minified bundle
rollup({
  input: 'src/lite-url.js',
  plugins: [...plugins, uglify({
    ie8: true,
    ecma: 5,
    output: {
      comments: 'some'
    }
  })]
}).then((bundle) => {
  bundle.write({
    format: 'iife',
    name: 'liteURL',
    file: 'dist/lite-url.min.js'
  });
});
