declare module '*.png';

declare module '*.svg' {
	const content: string;
	// eslint-disable-next-line import/no-default-export
	export default content;
}

declare const __API_URL__: string;
