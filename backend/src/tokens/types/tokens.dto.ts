export interface TokenDto {
	id: number;
	token: string;
	userId: number;
}

export interface TokensDto {
	accessToken: string;
	refreshToken: string;
}
