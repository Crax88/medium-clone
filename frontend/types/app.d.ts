declare global {
	declare const __API_URL__: string;

	declare module '*.png';

	declare module '*.module.css';

	declare module '*.svg' {
		import * as React from 'react';

		import React from 'react';
		const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
		export default SVG;
	}

	/**
	 * Custom utility types
	 */
	export type Nullable<T> = T | null;

	export type Keys<T extends Record<string, unknown>> = keyof T;

	export type Values<T extends Record<string, unknown>> = T[Keys<T>];

	export type Indexed<K = string, T = unknown> = { [key: K]: T };

	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	declare type RootState = import('../src/app/store').RootState;
	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	declare type AppDispatch = import('../src/app/store').AppDispatch;
}

export {};
