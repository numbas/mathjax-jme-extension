const PACKAGE = require('../components/webpack.common.js');

const config = PACKAGE(
  'jme',                                // the name of the package to build
  '../js',    // location of the mathjax library
  [                                     // packages to link to
     'components/src/core/lib',
     'components/src/input/tex-base/lib'
  ],
  __dirname,                            // our directory
  '.'                                   // where to put the packaged component
);

config.mode = 'development';

module.exports = config;
