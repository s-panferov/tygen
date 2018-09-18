const {
	buildConfig,
	stats,
	DEVELOPMENT,
	MiniCssExtractPlugin
} = require('./webpack.common')

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

finalConfig.module.rules.push({
	test: /\.css$/,
	use: [DEVELOPMENT ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
})

module.exports = finalConfig
