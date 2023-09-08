import { TProfile } from 'entities/profile';

export type TFollowProfileRequestDto = {
	username: TProfile['username'];
};
export type TFollowProfileResponseDto = {
	profile: TProfile;
};
