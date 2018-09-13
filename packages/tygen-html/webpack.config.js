module.exports = {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	entry: {
		index: './src/index.tsx'
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"]
	},
	module: {
		rules: [{
			test: /\.(tsx?|jsx?)$/,
			include: (a, b, c, d) => console.log(d),
			exclude: /(node_modules|bower_components)/,
			loader: 'linaria-module'
		}, {
			test: /\.(tsx?|jsx?)$/,
			exclude: /(node_modules|bower_components)/,
			use: [{
				loader: 'ts-loader',
				options: {
					transpileOnly: true
				}
			}]
		}, {
			test: /\.css$/,
			use: ['style-loader', 'css-loader']
		}]
	}
}
