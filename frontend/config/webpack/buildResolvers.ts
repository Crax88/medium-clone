import { ResolveOptions } from 'webpack';
import { BuildOptions } from './types';

export const buildResolvers = (options: BuildOptions): ResolveOptions => {
	return {
		extensions: ['.tsx', '.ts', '.js'],
		preferAbsolute: true,
		modules: [options.pathes.src, 'node_modules'],
		mainFiles: ['index'],
	};
};
