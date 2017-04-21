const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: `${__dirname}/src/app.js`,
	output: {
		path: `${__dirname}/dist/`,
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			}
		]
	},
	plugins: [
		// new UglifyJSPlugin()
	]
}
