var webpack = require('webpack');
var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var _ = require('lodash-node');
var TsImmutablePlugin = require('./node_modules/tsimmutable/dist/plugin.js');
var SplitByPathPlugin = require('webpack-split-by-path');

module.exports = function(options) {
    var isTest = options.isTest;
    var isProduction = options.isProduction;
    var isStandalone = options.isStandalone;
    var doTypeCheck = options.doTypeCheck;

    var externals = [
        
    ].join('');

    var ATL_OPTIONS = [
        '&target=es6',
        '&rewriteImports[]=tsflux',
        '&jsx=react',
        '&+experimentalDecorators',
        '&+useBabel',
        '&+useCache',
        externals
    ].join('');

    if (!isStandalone && !isTest) {
        ATL_OPTIONS += '&+forkChecker';
    }

    if (!doTypeCheck) {
        ATL_OPTIONS += '&-doTypeCheck';
    }

    var config = {
    //   cache: true,

      devServer: {
        contentBase: "./dist"
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
        extensions: ['', '.ts', '.tsx', '.webpack.js', '.web.js', '.js', '.styl'],
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
        loaders: [
          isStandalone
            ? {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader?" + ATL_OPTIONS
              }
            : {
                test: /\.tsx?$/,
                loaders: ["react-hot", "awesome-typescript-loader?" + ATL_OPTIONS]
              },
          {
            test: /\.json?$/,
            loader: "json-loader"
          }
        ]
      },

      plugins: [
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru|en-gb/),
        new HtmlWebpackPlugin({ template: 'index.html', filename: '../index.html' }),
        new webpack.ProvidePlugin({
            React: "react"
        }),
        new TsImmutablePlugin({
            files: [
                './src/models.ts',
            ],

            /*
             * Every option below is optional.
             */

            suffix: '-i',
            verbose: true,
            indexerType: 'any',
            emitMaps: false,
            emitRecords: true,
            emitMarkers: true,
            emitEmptyRecords: true,
            emitTypedMethods: true,
            defaultEmptyType: 'null'
        })
      ]
    };

    if (!isStandalone) {
        config.plugins = config.plugins.concat([
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin()
        ])
    }

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

    if (!isTest) {
        config.module.loaders = config.module.loaders.concat([
            {
              test: /\.css$/,
              loader: "style-loader!css-loader!postcss-loader"
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
            {
              test: /\.(jpe?g|png|gif|svg)$/i,
              loaders: [
                'file-loader?hash=sha512&digest=hex&name=[hash].[ext]'
              ]
            }
        ]);

        config.plugins = config.plugins.concat([
            (function() {
                var plugin = new SplitByPathPlugin([
                    {
                        name: 'vendor.bundle'
                    }
                ])

                plugin.buckets[0].path = [
                    /node_modules/,
                    /webpack/,
                ];

                return plugin;
            })()
        ])

        _.assign(config, {
            entry: {
              app: [
                  './src/index.tsx'
              ]
            },

            output:{
              path: path.join(__dirname, 'dist', 'assets'),
              publicPath: '/assets/',
              filename: '[name].js',
              chunkFilename: "[name].js"
            }
        });

        config.postcss = [
            require('postcss-nested'),
            require('autoprefixer'),
            require('lost'),
            require('postcss-custom-properties')({
                variables: require('./src/css-variables')
            })
        ];
    } else {
        config.plugins = config.plugins.concat([
            new webpack.NormalModuleReplacementPlugin(/(\.css|\.png|\.svg|\.styl)$/, 'node-noop')
        ])
    }

    return config;
}
