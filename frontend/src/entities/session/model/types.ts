export type User = {
	email: string;
	username: string;
	bio: string;
	image: string | null;
};

export type Token = string;

export type Session = {
	acccessToken: Token;
	user: User;
};
