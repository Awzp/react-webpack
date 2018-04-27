const path = require('path');
const webpack = require('webpack');
const utils = require('./utils.js');
let config = require('../config')
let isProd = process.env.NODE_ENV === 'production'
function resolve(dir) {
  return path.join(__dirname, '../../', dir)
}

module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: isProd ? config.build.entry : config.dev.entry,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: isProd ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      resolve('node_modules')
    ],
    alias: {
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('example')]
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },

      {
        test: /\.svg$/,
        use: [
          'file-loader',
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }, 
          {
            loader: 'react-svg-loader',
            options: {
              svgo: {
                plugins: [{ removeStyleElement: true }],
                floatPrecision: 2
              }
            }
          }
        ],
        exclude: [path.resolve('./node_modules/'), path.resolve('./src/images/svg/')]
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        options: {
          runtimeCompat: true
        },
        include: path.resolve('./src/images/svg/')
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
}