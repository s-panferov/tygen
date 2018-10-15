const {
	buildConfig,
	stats
} = require('./webpack.common')

const WriteFilePlugin = require('write-file-webpack-plugin')

const config = buildConfig()

const finalConfig = Object.assign({}, config, {
	entry: {
		index: './src/index.tsx'
	},
	externals: {
		prettier: 'prettier',
		'react-dom/server': 'ReactDOM.Server',
		'react-dom': 'ReactDOM',
		'react': 'React'
	},
	node: {
		path: true
	},
	devServer: {
		stats,
		historyApiFallback: true,
		hot: true,
		port: 9000,
		proxy: {
			'**': 'http://localhost:3000'
		}
	},
})

finalConfig.plugins.push(new WriteFilePlugin())

module.exports = finalConfig
