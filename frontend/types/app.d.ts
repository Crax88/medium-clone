declare global {
	/**
	 * Custom utility types
	 */
	export type Nullable<T> = T | null;

	export type Keys<T extends Record<string, unknown>> = keyof T;

	export type Values<T extends Record<string, unknown>> = T[Keys<T>];

	export type Indexed<K = string, T = unknown> = { [key: K]: T };

	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	declare type RootState = import('../src/app/appStore').RootState;
	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	declare type AppDispatch = import('../src/app/appStore').AppDispatch;
}

export {};
