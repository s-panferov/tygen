const nodeExternals = require('webpack-node-externals');
const path = require('path');

const {
	buildConfig,
	MiniCssExtractPlugin
} = require('./webpack.common')

const config = buildConfig()
const whitelist = [/@tygen/, 'webpack/hot/dev-server', /\.css$/]

const finalConfig = Object.assign({}, config, {
	entry: {
		server: './src/server.ts'
	},
	target: 'node',
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

finalConfig.module.rules.push({
	test: /\.css$/,
	use: [MiniCssExtractPlugin.loader, 'css-loader']
})

module.exports = finalConfig
