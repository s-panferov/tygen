var webpack = require('webpack');
var path = require("path");

var ATL_OPTIONS = [
    '&target=es6',
    '&jsx=react',
    '&+experimentalDecorators',
    '&+useBabel',
    '&+generateDoc'
].join();

var base = __dirname + '../'

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
        alias: {
            "lodash": "lodash-node/modern"
        }
    },

    node: {
        fs: "empty"
    },

    // Source maps support (or 'inline-source-map' also works)
    devtool: 'source-map',

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
