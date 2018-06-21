const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const env = process.env.NODE_ENV || 'development';

module.exports = {
  mode: env,
  context: path.resolve(__dirname, 'src'),
  entry: {
    style: './style.scss',
    './assets/js/events': './assets/js/events.js',
    './assets/js/slider': './assets/js/slider.js',
    './assets/js/lazyload': './assets/js/lazyload.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|dist)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              config: {
                ctx: {
                  cssnano: {},
                  autoprefixer: {}
                }
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin([
      {
        from: '**/*',
        to: '',
        ignore: [
          '*.js',
          '*.scss',
          '*.woff',
          '*.woff2',
          '*.eot',
          '*.ttf',
          '*.otf'
        ]
      }
    ]),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      disable: env !== 'production'
    })
  ]
};
