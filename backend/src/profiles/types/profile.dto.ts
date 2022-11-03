export interface ProfileDto {
	username: string;
	bio: string | null;
	image: string | null;
	following: boolean;
}

export interface ProfileResponseDto {
	profile: ProfileDto;
}
