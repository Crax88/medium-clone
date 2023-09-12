import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { sessionApi } from '../api/sessionApi';
import { User, type Session } from './types';

type SessionState =
	| ({ isAuth: true } & Session)
	| ({ isAuth: false } & Partial<Session>);

const initialState: SessionState = {
	isAuth: false,
};

export const sessionSlice = createSlice({
	name: 'session',
	initialState,
	reducers: {
		clearSession: (state) => {
			state.isAuth = false;
			state.acccessToken = undefined;
			state.user = undefined;
		},
		updateUser: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addMatcher(
			sessionApi.endpoints.login.matchFulfilled,
			(state: SessionState, { payload }) => {
				state.isAuth = true;
				state.acccessToken = payload.acccessToken;
				state.user = payload.user;
			},
		);
		builder.addMatcher(
			sessionApi.endpoints.register.matchFulfilled,
			(state: SessionState, { payload }) => {
				state = {
					isAuth: true,
					acccessToken: payload.acccessToken,
					user: payload.user,
				};
				// state.isAuth = true;
				// state.acccessToken = payload.acccessToken;
				// state.user = payload.user;
			},
		);
	},
});

export const selectIsAuth = (state: RootState) => state.session.isAuth;

export const selectUser = (state: RootState) => state.session.user;

export const { clearSession, updateUser } = sessionSlice.actions;
