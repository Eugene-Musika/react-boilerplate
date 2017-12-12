/* eslint-disable sort-keys */
/**
 * WEBPACK DLL GENERATOR
 *
 * This profile is used to cache webpack's module
 * contexts for external library and framework type
 * dependencies which will usually not change often enough
 * to warrant building them from scratch every time we use
 * the webpack process.
 */

import defaults from 'lodash/defaultsDeep';
import { dllPlugin } from '../config';
import path from 'path';
import webpack from 'webpack';
import webpackBaseConfig from './webpack.config.base.babel';


const pkg = require(path.join(process.cwd(), 'package.json'));

if (!pkg.dllPlugin) { process.exit(0); }

const dllConfig = defaults(pkg.dllPlugin, dllPlugin.defaults);
const outputPath = path.join(process.cwd(), dllConfig.path);

export default webpackBaseConfig({
	context: process.cwd(),
	entry: dllConfig.dlls ? dllConfig.dlls : dllPlugin.entry(pkg),
	devtool: 'eval',
	output: {
		filename: '[name].dll.js',
		path: outputPath,
		library: '[name]'
	},
	plugins: [
		new webpack.DllPlugin({
			name: '[name]',
			path: path.join(outputPath, '[name].json')
		})
	],
	performance: { hints: false }
});
