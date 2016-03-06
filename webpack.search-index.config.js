var webpack = require('webpack');
var path = require("path");
var fs = require("fs");

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
    entry: {
        'search-index': [
            './src/search-index/index.ts'
        ]
    },

    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'assets/search-index.js',
    },

    resolveLoader: {
        root: [
            path.join(__dirname, 'node_modules')
        ]
    },

    resolve: {
        root: [
            path.join(__dirname, "node_modules"),
            path.join(__dirname, "bower_components"),
        ],
        extensions: ['', '.ts', '.tsx', '.webpack.js', '.web.js', '.js'],
        alias: {
        }
    },

    // Source maps support (or 'inline-source-map' also works)
    devtool: 'source-map',

    module: {
        loaders: [{
            test: /\.tsx?$/,
            loader: "awesome-typescript-loader?" + ATL_OPTIONS
        }]
    },

    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ),
    ]
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
