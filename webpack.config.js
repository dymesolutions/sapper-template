const webpack = require('webpack');
const config = require('sapper/config/webpack.js');
const pkg = require('./package.json');

const preprocessors = require('./webpack.preprocessors');

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

module.exports = {
	cache: false,	// Apparently required for our TypeScript/Svelte integration to work (client for sure, not sure about server)
	client: {
		entry: config.client.entry(),
		output: config.client.output(),
		resolve: {
			extensions: ['.ts', '.js', '.json', '.html'],
			mainFields: ['svelte', 'module', 'browser', 'main']
		},
		module: {
			rules: [
				{
					// Do not use SASS or TypeScript in .html files, they are not preprocessed
					test: /\.html$/,
					use: {
						loader: 'svelte-loader',
						options: {
							dev,
							hydratable: true,
							hotReload: true
						}
					}
				},
				{
					// Do not try to do .(html|svelte), something in the build process goes wrong and a mixed input is served to preprocess
					test: /\.svelte$/,
					use: {
						loader: 'svelte-loader',
						options: {
							dev,
							hydratable: true,
							hotReload: true,
							externalDependencies: preprocessors.externalDependencies,
							preprocess: {
								style: preprocessors.sass,
								script: preprocessors.typescript
							}
						}
					}
				},
				{
					test: /\.ts?$/,
					loader: 'ts-loader'
				}
			]
		},
		mode,
		plugins: [
			dev && new webpack.HotModuleReplacementPlugin(),
			new webpack.DefinePlugin({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
		].filter(Boolean),
		devtool: dev && 'inline-source-map'
	},

	server: {
		cache: false,	// Apparently required for our TypeScript/Svelte integration to work (client for sure, not sure about server)
		entry: config.server.entry(),
		output: config.server.output(),
		target: 'node',
		resolve: {
			extensions: ['.ts', '.js', '.json', '.html'],
			mainFields: ['svelte', 'module', 'browser', 'main']
		},
		externals: Object.keys(pkg.dependencies),
		module: {
			rules: [
				{
					// Do not use SASS or TypeScript in .html files, they are not preprocessed
					test: /\.html$/,
					use: {
						loader: 'svelte-loader',
						options: {
							css: false,
							generate: 'ssr',
							dev
						}
					}
				},
				{
					// Don't try to do .(html|svelte), something in the build process goes wrong and a mixed input is served to preprocess
					test: /\.svelte$/,
					use: {
						loader: 'svelte-loader',
						options: {
							css: false,
							generate: 'ssr',
							dev,
							externalDependencies: preprocessors.externalDependencies,
							preprocess: {
								style: preprocessors.sass,
								script: preprocessors.typescript
							}
						}
					}
				},
				{
					test: /\.ts?$/,
					loader: 'ts-loader'
				}
			]
		},
		mode: process.env.NODE_ENV,
		performance: {
			hints: false // it doesn't matter if server.js is large
		}
	},

	serviceworker: {
		entry: config.serviceworker.entry(),
		output: config.serviceworker.output(),
		mode: process.env.NODE_ENV
	}
};
