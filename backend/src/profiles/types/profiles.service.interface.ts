import { ProfileResponseDto } from './profile.dto';

export interface ProfilesServiceInterface {
	getProfile: (username: string, currentUserId?: number) => Promise<ProfileResponseDto>;
	followProfile: (username: string, currentUserId: number) => Promise<ProfileResponseDto>;
	unfollowProfile: (username: string, currentUserId: number) => Promise<ProfileResponseDto>;
}
