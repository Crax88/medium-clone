export type SessionDto = {
	user: {
		email: string;
		token: string;
		username: string;
		bio: string;
		image: string | null;
	};
};

export type RequestLoginDto = {
	email: string;
	password: string;
};

export type RequestRegisterDto = {
	email: string;
	password: string;
	username: string;
};

export type UserDto = {
	email: string;
	token: string;
	username: string;
	bio: string;
	image: string | null;
};
