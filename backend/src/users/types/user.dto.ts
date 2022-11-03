export interface UserDto {
	id: number;
	username: string;
	email: string;
	password: string;
	bio: string | null;
	image: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface UserResponseDto {
	user: Pick<UserDto, 'username' | 'bio' | 'image' | 'email'> & { token: string };
	refreshToken: string;
}
