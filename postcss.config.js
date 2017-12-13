/* eslint-disable sort-keys */

module.exports = ({ _file, options, env }) => Object.assign({
	plugins: {
		'postcss-triangle': {}, 	// "triangle: pointing-<up|down|left|right>;"
															// "width:  [length];"
															// "height: [length];"
															// "background-color: [color];" (optional)
		'postcss-circle': {},   	// "circle: [diameter] [color]"
		'postcss-center': {},   	// "top: center; left: center;"
															//? don't forget about "position: relative" for parent
		'postcss-pxtorem': {},
		'postcss-utilities': {},  // INFO: http://ismamz.github.io/postcss-utilities/docs
		'postcss-short': {},			// INFO: http://github.com/jonathantneal/postcss-short
		'postcss-will-change': {},
		'postcss-vmin': {},
		'postcss-cssnext': { //NOTE: CSSnext has autoprefixer
			browsers: [
				'> 5%',
				'last 2 versions',
				'ie >= 10',
				'ios >= 7'
			]
		},
		'rucksack-css': {}, // INFO: https://www.rucksackcss.org/docs/
		// package includes:
		// postcss-alias     =>  "@alias {cl: color; l: left; ...}"
		// postcss-clearfix  =>  "clear: fix"
		// postcss-easings   =>  INFO: http://easings.net

		'postcss-svgo': env === 'production' ? {} : false,
		'css-mqpacker': env === 'production' ? {} : false,
		'postcss-merge-rules': env === 'production' ? {} : false,
		cssnano: env === 'production' ? {} : false,

		// Reporter //TODO: check if it works
		'postcss-browser-reporter': env === 'production' ? false : {}  // OR
		// 'postcss-reporter': env === 'production' ? false : {},      // OR
	}
}, options);
