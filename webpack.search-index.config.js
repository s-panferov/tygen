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

console.log(path.join(__dirname, 'src', 'explorer'));

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
        extensions: ['', '.ts', '.tsx', '.js'],
    },

    // Source maps support (or 'inline-source-map' also works)
    devtool: 'source-map',

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader?" + ATL_OPTIONS
            },
            {
                loader: "null-loader",
                include: [
                    // don't accidentally include anything from explorer
                    path.join(__dirname, 'src', 'explorer')
                ],
            }
        ]

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
