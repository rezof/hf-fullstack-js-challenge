const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('./webpack.config')

config.output.filename = 'app.[chunkhash].js'
config.plugins = [
  new HtmlWebpackPlugin({
    title: 'fullstack js challenge',
    template: './server/views/index.html',
    filename: '../../index.html',
    inject: 'body'
  })
]

module.exports = config
