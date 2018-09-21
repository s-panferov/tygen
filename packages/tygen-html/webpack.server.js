const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');

const {
	buildConfig,
	MiniCssExtractPlugin
} = require('./webpack.common')

const config = buildConfig()
const whitelist = [/@tygen/, 'webpack/hot/dev-server', /\.css$/, /\.svg$/]

const finalConfig = Object.assign({}, config, {
	entry: {
		cli: './src/cli.ts'
	},
	target: 'node',
	node: {
		__dirname: false
	},
	externals: [
		nodeExternals({
			whitelist
		}),
		nodeExternals({
			whitelist,
			modulesDir: path.resolve(__dirname, '../../node_modules')
		})
	]
})

finalConfig.plugins.push(new webpack.optimize.LimitChunkCountPlugin({
	maxChunks: 1
}))


module.exports = finalConfig
