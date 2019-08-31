const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const entry = require('./config/get-entry')('./src/pages');

module.exports = {
  entry: entry,
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname,'dist'),
    publicPath: './',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader"
        }
      },
      {
        test: /\.(css|less)$/,
        use: [
          { 
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            }
          },
          { loader: 'css-loader' },
          { loader: 'less-loader' },
        ]
      },
      {
        test: /\.(jpeg|jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 20000,
              outputPath: 'images',
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 每次打包前删除dist文件夹
    new HtmlWebpackPlugin({
      title: '主页',
      filename: 'index.html',
      template: './src/template/index.html',
      chunks: ['vendor', 'utils', 'index'],
    }),
    new HtmlWebpackPlugin({
      title: '关于我们',
      filename: 'about.html',
      template: './src/template/index.html',
      chunks: ['vendor', 'utils', 'about'],
    }),
    // 提取css文件
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: 'vendor'
        },
        default: {
          minSize: 0,
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
          name: 'utils'
        }
      }
    }
  },
  devServer: {
    // 设置服务器访问的基本目录
    contentBase: path.resolve(__dirname,'dist'), //最好设置成绝对路径
    // 启动的服务端口
    port: 8000,
    // 通过localhost或IP进行访问
    host: 'localhost',
    // 若编译过程中有错误，显示到网页上,便于定位错误
    overlay: {
      errors: true,
    },
    //热加载
    hot: true,
    // 设置自动拉起浏览器
    open:true
  }
}