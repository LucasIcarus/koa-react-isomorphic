'use strict';

const path = require('path');
const cssnext = require('postcss-cssnext');
const ROOT = require('./../../path-helper').ROOT;
const config = require('./../../index');
const webpack = require('webpack');

module.exports = {
  context: ROOT,
  entry: {
    app: [
      path.join(ROOT, config.path.app, 'app'),
    ],
    common: [
      path.join(ROOT, config.path.app, 'client/libs/index'),
      'isomorphic-fetch',
      'lodash',
      'react',
      'react-dom',
      'react-relay',
      'react-router',
      'react-router-relay',
      'recompose',
      'recompose-relay',
    ],
  },
  output: {
    path: path.join(ROOT, config.path.publicAssets),
  },
  externals: [],
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve('./app'),
      'node_modules',
    ],
  },
  module: {
    loaders: [
      {
        test: /\.async\.jsx$/,
        loader: 'react-proxy-loader!exports-loader?exports.default',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg|ttf|eot|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      test: /\.(js|jsx)$/,
      options: {
        eslint: {
          emitWarning: true,
        },
      },
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.(css|less|scss)$/,
      options: {
        postcss() {
          return [cssnext()];
        },
      },
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.RUNTIME_ENV': "'client'",
    }),
  ],
};
