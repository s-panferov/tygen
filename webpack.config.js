var webpack = require('webpack');
var path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  entry: {
    app: './src/index.ts',
    vendor: [
       'lodash',
       'react',
       'react/addons',
       'underscore.string/index.js',
       'bem-cn',
       'lodash',
       'material-ui'
    ]
  },

  output:{
    path: './dist',
    filename: '[name].js'
  },

  resolve: {
    root: [path.join(__dirname, 'bower_components'), path.join(__dirname, 'node_modules')],
    extensions: ['', '.ts', '.webpack.js', '.web.js', '.js', '.styl'],
    alias: {
      'underscore.string': 'underscore.string/index.js'
    }
  },

  resolveLoader: {
    root: [path.join(__dirname, 'bower_components'), path.join(__dirname, 'node_modules')],
  },

  devServer: {
    publicPath: '/',
    contentBase: './dist',
    hot: true,
    inline: true
  },

  node: {
    fs: 'empty'
  },

  // Source maps support (or 'inline-source-map' also works)
  devtool: 'source-map',

  module: {
    loaders: [
      { test: /\.json?$/, loader: 'json-loader' },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader'},
      { test: /\.ts$/, loader: 'awesome-typescript-loader?rewriteImports=awesome-typescript-loader&emitRequireType=false' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      { test: /\.css$/, exclude: /\.useable\.css$/, loader: "style!css" },
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'vendor.bundle.js'),
    new webpack.ResolverPlugin(
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
    ),
    new HtmlWebpackPlugin()
  ]
};
