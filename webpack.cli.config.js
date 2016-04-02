var webpack = require('webpack');
var path = require("path");
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
    entry: {
        'loader-plugin': [
            './src/loader-plugin/index.ts'
        ],
        'cli': [
            './src/cli/index.ts'
        ]
    },

    target: 'node',

    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'commonjs2',
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

    externals: nodeModules,

    plugins: [
        new webpack.BannerPlugin('require("source-map-support").install();',
            { raw: true, entryOnly: false }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require("./dist/manifest.json"),
            name: "require('./docscript.js')",
            sourceType: "commonsjs2",
        })
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
