import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from 'shared/api';
import { rootReducer } from './rootReducer';

export function makeStore() {
	const store = configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(baseApi.middleware),
	});

	return store;
}

export const appStore = makeStore();

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
