import webpack from 'webpack';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { buildResolvers } from './buildResolvers';
import { buildLoaders } from './buildLoaders';
import { buildPlugins } from './buildPlugins';
import { buildDevServer } from './buildDevServer';
import { BuildOptions } from './types';

export const buildWebpackConfig = (
	options: BuildOptions,
): webpack.Configuration => {
	const { mode, pathes, isDev } = options;
	return {
		mode,
		entry: pathes.entry,
		output: {
			filename: '[name].[contenthash].js',
			path: pathes.build,
			clean: true,
		},
		plugins: buildPlugins(options),
		module: {
			rules: buildLoaders(options),
		},
		resolve: buildResolvers(options),
		devtool: isDev ? 'inline-source-map' : undefined,
		devServer: isDev ? buildDevServer(options) : undefined,
		stats: 'errors-warnings',
		performance: options.isDev
			? undefined
			: {
					hints: 'warning',
					maxAssetSize: 100 * 1024,
					maxEntrypointSize: 100 * 1024,
			  },
		optimization: options.isDev
			? undefined
			: {
					minimizer: [
						new CssMinimizerPlugin(),
						new TerserPlugin({ test: /\.(ts|tsx|js)$/ }),
					],
					moduleIds: 'deterministic',
					runtimeChunk: {
						name: 'manifest',
					},
					minimize: true,
					splitChunks: {
						cacheGroups: {
							vendor: {
								name: 'vendor',
								test: /[\\/]node_modules[\\/]/,
								chunks: 'all',
							},
						},
					},
			  },
	};
};
