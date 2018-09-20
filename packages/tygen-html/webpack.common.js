const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require("extract-css-chunks-webpack-plugin")
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const DEVELOPMENT = process.env.NODE_ENV !== 'production'

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
		// devtool: 'cheap-module-eval-source-map',
		devtool: 'source-map',
		mode: DEVELOPMENT ? 'development' : 'production',
		stats,
		resolve: {
			extensions: [".ts", ".tsx", ".js"]
		},
		output: {
			publicPath: '/-/assets/'
		},
		module: {
			rules: [{
					test: /\.(tsx?|jsx?)$/,
					exclude: /(node_modules|bower_components)/,
					use: [{
						loader: 'linaria/loader',
						options: {
							sourceMap: true,
						},
					}, {
						loader: 'babel-loader',
					}, {
						loader: 'ts-loader',
						options: {
							transpileOnly: true
						}
					}]
				},
				{
					test: /\.(png|jpg|gif|svg)$/,
					use: [{
						loader: 'url-loader',
					}]
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
			new MiniCssExtractPlugin({
				hot: DEVELOPMENT
			}),
			new HardSourceWebpackPlugin(),
		]
	}
}

module.exports = {
	buildConfig,
	stats,
	DEVELOPMENT,
	MiniCssExtractPlugin
}
