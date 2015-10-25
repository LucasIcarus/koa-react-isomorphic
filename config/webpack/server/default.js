'use strict';

var fs          = require('fs');
var path        = require('path');
var _           = require('lodash');
var webpack     = require('webpack');
var config      = require('config/config.json');
var ROOT        = require('config/path-helper').ROOT;
var nodeModules = _.reduce(
                    // more info on https://github.com/jlongster/blog/blob/master/gulpfile.js
                    _.filter(fs.readdirSync('node_modules'), function(x) {
                      return ['.bin'].indexOf(x) === -1;
                    }),
                    function(modules, mod) {
                      modules[mod] = 'commonjs ' + mod;

                      return modules;
                    },
                    {}
                  );

module.exports = {
  context: ROOT,
  target: 'node',
  node: {
    __dirname: true,
    __filename: true
  },
  entry: {
    server: path.join(ROOT, config.path.app, 'server')
  },
  output: {
    path: path.join(ROOT, config.path.build),
    publicPath: config.path.assets,
    filename: '[name].js',
    chunkFilename: '[id].js'
  },
  externals: [
    nodeModules,
    function(context, request, callback) {
      var external = 'external!';

      return (new RegExp('^' + external)).test(request)
        ? callback(null, 'commonjs ' + path.join(ROOT, request.substr(external.length)))
        : callback();
    }
  ],
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(gif|jpg|png|svg)$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/\.(css|less|scss|eot|woff|woff2)$/, 'node-noop'),
    new webpack.DefinePlugin({
      'process.env.RUNTIME_ENV': "'server'"
    })
  ]
};
