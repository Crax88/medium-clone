import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import { BuildOptions } from './types';

export const buildLoaders = (options: BuildOptions): webpack.RuleSetRule[] => {
	const babelLoader = {
		test: /\.(ts|tsx|js)$/,
		exclude: /node_modules/,
		use: [{ loader: 'babel-loader', options: { presets: ['@babel/preset-env'] } }],
	};

	const fileLoader = {
		test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
		type: 'asset/resource',
	};

	const assetLoader = {
		test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
		type: 'asset/inline',
	};
	const cssLoader = {
		test: /\.css$/i,
		use: [
			{
				loader: MiniCssExtractPlugin.loader,
			},
			{
				loader: 'css-loader',
				options: {
					modules: {
						auto: (path: string) => !!path.includes('.module'),
						localIdentName: options.isDev
							? '[path][name]__[local]--[hash:base64:5]'
							: '[hash:base64:8]',
					},
					sourceMap: options.isDev,
				},
			},
		],
	};

	return [assetLoader, fileLoader, cssLoader, babelLoader];
};
