var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
var env = config.build.env

// 增加各环境判断
var webpackConfig = merge(baseWebpackConfig, {
  mode:'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].js'),
    chunkFilename: utils.assetsPath('js/[id].js'),
  },
  performance: {
    hints: false
  },
  plugins: [
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify(env)
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].css'),
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      // minify: {
      //   removeComments: true,
      //   collapseWhitespace: true,
      //   removeAttributeQuotes: true
      //   // more options:
      //   // https://github.com/kangax/html-minifier#options-quick-reference
      // },
      // // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // chunksSortMode: 'dependency'
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../dll/manifest.json'),
    }),
    new AddAssetHtmlPlugin([{
      filepath: utils.getDllPath('../dll'),
      hash: false,
      includeSourcemap: false
    }]),
  ]
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
