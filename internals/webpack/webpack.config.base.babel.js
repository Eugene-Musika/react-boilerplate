/**
 * COMMON WEBPACK CONFIGURATION
 */

/* eslint-disable sort-keys */
const path = require('path');
const webpack = require('webpack');

// Remove this line once the following warning goes away (it was meant for webpack loader authors not users):
// 'DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic,
// see https://github.com/webpack/loader-utils/issues/56 parseQuery() will be replaced with getOptions()
// in the next major version of loader-utils.'
process.noDeprecation = true;

module.exports = options => ({
	entry: options.entry,
	output: Object.assign({ // Compile into js/build.js
		path: path.resolve(process.cwd(), 'build'),
		publicPath: '/'
	}, options.output), // Merge with env dependent settings
	module: {
		rules: [
			{
				test: /\.js$/, // Transform all .js files required somewhere with Babel
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: options.babelQuery
				}
			},
      // Preprocess our own .scss files
      // This is the place to add your own loaders (e.g. sass/less etc.)
      // for a list of loaders, see https://webpack.js.org/loaders/#styling
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: true,
							camelCase: true, // for className styles (not for styleName)
							localIdentName: '[local]__[hash:base64]'
						}
					}, {
						loader: 'postcss-loader',
						options: { sourceMap: true }
					}, {
						loader: 'sass-loader',
						options: { sourceMap: true }
					}
				]
			},
			{
				// Preprocess 3rd party .css files located in node_modules
				test: /\.css$/,
				include: /node_modules/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
				use: 'file-loader'
			},
			{
				test: /\.(jpg|png|gif)$/,
				use: [
					'file-loader',
					{
						loader: 'image-webpack-loader',
						options: {
							mozjpeg: {
								progressive: true,
								quality: 80
							},
							// optipng.enabled: false will disable optipng
							optipng: { enabled: false },
							pngquant: {
								quality: '65-90',
								speed: 4
							},
							gifsicle: { interlaced: false },
							svgo: {
								plugins: [
									{ removeUselessDefs: false },
									{ cleanupIDs: false }
								]
							},
							// the webp option will enable WEBP
							webp: { quality: 75 }
						}
					}
				]
			},
			{
				test: /\.html$/,
				use: 'html-loader'
			},
			{
				test: /\.json$/,
				use: 'json-loader'
			},
			{
				test: /\.(mp4|webm)$/,
				use: {
					loader: 'url-loader',
					options: { limit: 10000 }
				}
			}
		]
	},
	plugins: options.plugins.concat([
		new webpack.ProvidePlugin({
			// make fetch available
			fetch: 'exports-loader?self.fetch!whatwg-fetch'
		}),

		// Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
		// inside your code for any environment checks; UglifyJS will automatically
		// drop any unreachable code.
		new webpack.DefinePlugin({
			__DEV__: process.env.NODE_ENV === 'development',
			'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV) }
		}),
		new webpack.NamedModulesPlugin()
	]),
	resolve: {
		modules: ['app', 'node_modules'],
		extensions: [
			'.js',
			'.jsx',
			'.react.js'
		],
		mainFields: [
			'browser',
			'jsnext:main',
			'main'
		]
	},
	devtool: options.devtool,
	target: 'web', // Make web variables accessible to webpack, e.g. window
	performance: options.performance || {}
});
