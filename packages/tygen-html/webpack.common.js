const path = require('path')
const webpack = require('webpack');

const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require("extract-css-chunks-webpack-plugin")
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const DEVELOPMENT = process.env.NODE_ENV !== 'production'

const SpritePlugin = require(`svg-sprite-loader/plugin`)

const stats = {
	warningsFilter: /export .* was not found in/,
	children: false,
	chunks: false,
	chunkModules: false,
	modules: false,
	reasons: false,
	usedExports: false,
}

function buildConfig() {
	return {
		devtool: 'source-map',
		mode: DEVELOPMENT ? 'development' : 'production',
		stats,
		resolve: {
			extensions: [".ts", ".tsx", ".js"]
		},
		output: {
			publicPath: '-/assets/'
		},
		module: {
			rules: [{
					test: /\.(tsx?|jsx?)$/,
					exclude: /(node_modules|bower_components)/,
					use: [{
							loader: 'linaria/loader',
							options: {
								sourceMap: true,
								displayName: true
							}
						},
						{
							loader: 'babel-loader',
						}, {
							loader: 'ts-loader',
							options: {
								transpileOnly: true,
								compilerOptions: {
									composite: false,
									declaration: false,
									declarationMap: false
								}
							}
						}
					]
				},
				{
					test: /\.(png|jpg|gif)$/,
					use: [{
						loader: 'file-loader',
					}]
				},
				{
					test: /\.svg$/,
					loader: 'file-loader',
					include: /tsd.svg$/,
				},
				{
					test: /\.svg$/,
					loader: 'svg-sprite-loader',
					exclude: /tsd.svg$/
				},
				{
					test: /\.(ico)$/,
					use: [{
						loader: 'file-loader',
					}]
				},
				{
					test: /\.css$/,
					use: [MiniCssExtractPlugin.loader, 'css-loader']
				}
			]
		},
		optimization: {
			minimizer: [new TerserPlugin()]
		},
		plugins: [
			new webpack.NamedModulesPlugin(),
			new MiniCssExtractPlugin({
				hot: DEVELOPMENT
			}),
			// new HardSourceWebpackPlugin(),
			new SpritePlugin()
		]
	}
}

module.exports = {
	buildConfig,
	stats,
	DEVELOPMENT,
	MiniCssExtractPlugin
}
