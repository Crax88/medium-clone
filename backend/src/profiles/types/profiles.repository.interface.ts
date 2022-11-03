import { ProfileDto } from './profile.dto';

export interface ProfilesRepositoryInterface {
	getProfile: (profileUsername: string, currentUserId?: number) => Promise<ProfileDto | null>;
	followProfile: (profileUsername: string, followerId: number) => Promise<void>;
	unfollowProfile: (profileUsername: string, followerId: number) => Promise<void>;
}
