const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

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

			/*
			Inject CSS into style tag.
			 */
			// {
			// 	test: /\.css$/,
			// 	use: [
			// 		'style-loader',
			// 		'css-loader?importLoaders=1',
			// 		'postcss-loader',
			// 	]
			// },

			/*
			Extract CSS into a separate file
			 */
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader?importLoaders=1', 'postcss-loader']
				})
			},
		]
	},
	plugins: [
		new ExtractTextPlugin("styles.css"),
		// new UglifyJSPlugin()
	]
}
