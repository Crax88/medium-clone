export type UpdateProfileDto = {
	email: string;
	username: string;
	bio: string;
	image: string | null;
	password: string | null;
};
