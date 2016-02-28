'use strict';

const _ = require('lodash');
const webpack = require('webpack');
const defaultConfig = require('./default');
const productionConfig = require('./default');

_.mergeWith(defaultConfig, {
  devtool: false,
});

productionConfig.plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    mangle: {
      except: ['GeneratorFunction', 'GeneratorFunctionPrototype'],
    },
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': "'production'",
    'process.env.SERVER_RENDERING': true,
  })
);

module.exports = productionConfig;
