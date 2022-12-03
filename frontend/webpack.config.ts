import path from 'path';
import webpack from 'webpack';
import { buildWebpackConfig } from './config/webpack/buildWebpackConfig';
import { BuildEnv, BuildPathes } from './config/webpack/types';

const pathes: BuildPathes = {
	entry: path.resolve(__dirname, 'src', 'index.tsx'),
	build: path.resolve(__dirname, 'build'),
	html: path.resolve(__dirname, 'public', 'index.html'),
	src: path.resolve(__dirname, 'src'),
	assets: path.resolve(__dirname, 'public', 'assets'),
};

export default (env: BuildEnv = { mode: 'development', port: 3000, analyzerMode: 'off' }) => {
	const mode = env.mode;
	const port = env.port;
	const isDev = mode === 'development';
	const analyzerMode = env.analyzerMode === 'analyze';

	const config: webpack.Configuration = buildWebpackConfig({
		mode,
		pathes,
		isDev,
		port,
		title: 'Conduit',
		analyzer: analyzerMode,
	});

	return config;
};
