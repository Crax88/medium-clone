export type BuildMode = 'production' | 'development';

export interface BuildPathes {
	entry: string;
	build: string;
	html: string;
	src: string;
	assets: string;
}

export interface BuildEnv {
	mode: BuildMode;
	port: number;
	analyzerMode: string;
}

export interface BuildOptions {
	mode: BuildMode;
	pathes: BuildPathes;
	isDev: boolean;
	port: number;
	title: string;
	analyzer: boolean;
}
