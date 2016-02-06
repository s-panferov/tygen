var webpack = require('webpack');
var path = require("path");

var ATL_OPTIONS = [
    '&tsconfig=./tsconfig.json',
].join();

var base = path.resolve(__dirname + '/../');

var config = {

    entry: {
        index: './index.ts'
    },

    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },

    resolveLoader: {
        fallback: base + "/node_modules"
    },

    resolve: {
        root: [
            path.join(base, 'node_modules'),
        ],
        extensions: ['', '.ts', '.tsx', '.webpack.js', '.web.js', '.js'],
    },

    node: {
        fs: "empty"
    },

    devtool: 'eval',

    atl: {
        plugins: [
            {
                file: path.resolve(path.join(base, 'dist', 'loader-plugin.js')),
                options: {
                    output: path.resolve(path.join(__dirname, 'doc'))
                }
            }
        ]
    },

    module: {
        loaders: [{
            test: /(\.ts|\.tsx)$/,
            loader: "awesome-typescript-loader?" + ATL_OPTIONS
        }, {
            test: /\.json?$/,
            loader: "json-loader"
        }]
    }
};

module.exports = config;
