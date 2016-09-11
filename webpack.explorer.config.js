var webpack = require('webpack');
var path = require("path");
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
var webpackConfig = require('./webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {

    cache: true,

    entry: {
        index: [
            './src/explorer/entry.js'
        ].filter(Boolean)
    },

    bail: false,

    devServer: {
        contentBase: "./dist"
    },

    output: {
        path: path.join(__dirname, 'dist/assets'),
        filename: '[name].js',
        publicPath: PRODUCTION ? undefined : '/assets/'
    },

    resolveLoader: {
        fallback: __dirname + "/node_modules"
    },

    resolve: {
        extensions: ['', '.ts', '.tsx', '.js', '.jsx'],
        alias: {
            // "typescript": path.join(__dirname, 'src', 'explorer', 'typescript.ts')
        }
    },

    node: {
        fs: "empty"
    },

    // Source maps support (or 'inline-source-map' also works)
    devtool: !PRODUCTION ? 'eval' : 'source-map',

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loaders: [
                    "awesome-typescript-loader?compiler=typescript&+useCache&+forkChecker&tsconfig=./src/tsconfig.json"
                ].filter(Boolean)
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader",
            },
            {
                test: /\.(jpe?g|png|gif)(\?v=.*)?$/i,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=[hash].[ext]'
                ]
            },
            {
                test: /\.json?$/,
                loader: "json-loader"
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'DocScript Explorer',
            template: './index.html',
            filename: '../index.html',
            inject: false
        }),
        new ForkCheckerPlugin(),
        new webpack.DefinePlugin({
            DEBUG: process.env.NODE_ENV !== 'production',
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        })
    ].filter(Boolean)
};
