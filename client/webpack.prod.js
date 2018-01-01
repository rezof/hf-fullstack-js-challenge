const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const cleanWebpackPlugin = require('clean-webpack-plugin')
const config = require('./webpack.config')

const pathToClean = ['public/*']
const cleanOptions = { root: path.resolve(__dirname, '../') }

config.output.filename = 'app.[chunkhash].js'
config.plugins = [
  new cleanWebpackPlugin(pathToClean, cleanOptions),
  new htmlWebpackPlugin({
    template: './server/views/index.html',
    filename: '../../index.html',
    inject: 'body'
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    ie8: false,
    ecma: 5,
    sourceMap: false,
    minimize: true,
    mangle: true,
    comments: false,
    compress: {
      unused: true,
      dead_code: true
    },
    output: {
      comments: false
    }
  })
]

module.exports = config
