var webpack = require('webpack');
var path = require("path");
var _ = require('lodash-node');
var fs = require("fs");

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

var isProduction = false;

var ATL_OPTIONS = [
    '&target=es6',
    '&jsx=react',
    '&+experimentalDecorators',
    '&+useBabel',
    '&+useCache',
    '&tsconfig=./src/tsconfig.json'
].join('');

var config = {
    entry: './src/doc/doc.ts',

    target: 'node',

    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'docscript.js',
    },

    resolveLoader: {
        root: [
            path.join(__dirname, 'node_modules')
        ]
    },

    resolve: {
        root: [
            path.join(__dirname, 'node_modules'),
        ],
        extensions: ['', '.ts', '.tsx', '.webpack.js', '.web.js', '.js'],
        alias: {
            "lodash": "lodash-node/modern"
        }
    },

    node: {
        fs: true
    },

    // Source maps support (or 'inline-source-map' also works)
    devtool: 'source-map',

    module: {
        loaders: [{
            test: /\.tsx?$/,
            loader: "awesome-typescript-loader?" + ATL_OPTIONS
        }, {
            test: /\.json?$/,
            loader: "json-loader"
        }]
    },

    library: 'docscript',
    libraryTarget: 'commonjs2',
    externals: nodeModules,

    plugins: []
};

if (isProduction) {
    config.plugins = config.plugins.concat([
        new webpack.DefinePlugin({
            DEBUG: false
        })
    ])
} else {
    config.plugins = config.plugins.concat([
        new webpack.DefinePlugin({
            DEBUG: true
        })
    ])
}

module.exports = config;
