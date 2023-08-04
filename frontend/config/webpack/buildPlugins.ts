import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshWEbpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { BuildOptions } from './types';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import EslintWebPackPlugin from 'eslint-webpack-plugin';
import path from 'path';

export const buildPlugins = (
	options: BuildOptions,
): webpack.WebpackPluginInstance[] => {
	const plugins = [
		new HtmlWebpackPlugin({
			template: options.pathes.html,
			title: options.title,
			favicon: path.resolve(__dirname, '..', '..', 'public', 'favicon.ico'),
		}),

		new CopyWebpackPlugin({
			patterns: [{ from: options.pathes.assets, to: '.' }],
		}),
		new webpack.ProgressPlugin(),
		new MiniCssExtractPlugin({
			filename: 'css/[name].[contenthash:8].css',
			chunkFilename: 'css/[name].[contenthash:8].css',
		}),
		new webpack.DefinePlugin({
			__IS_DEV__: JSON.stringify(options.isDev),
			__API_URL__: JSON.stringify('/api'),
		}),
		new EslintWebPackPlugin({
			overrideConfigFile: path.resolve(__dirname, '..', '..', '.eslintrc'),
			extensions: ['tsx', 'ts'],
		}),
	];

	if (options.isDev) {
		plugins.push(new ReactRefreshWEbpackPlugin());
		plugins.push(new webpack.HotModuleReplacementPlugin());
		plugins.push(new ForkTsCheckerWebpackPlugin());
	}
	if (options.analyzer) {
		plugins.push(new BundleAnalyzerPlugin({ openAnalyzer: true }));
	}
	return plugins;
};
