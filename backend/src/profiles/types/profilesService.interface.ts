import { ProfileDto } from './profile.dto';

export interface ProfilesServiceInterface {
	getProfile: (username: string, userId?: number) => Promise<ProfileDto>;
	followProfile: (username: string, userId: number) => Promise<ProfileDto>;
}
