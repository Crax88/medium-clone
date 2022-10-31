import { User } from '../../users/user.entity';

export interface ProfilesRepositoryInterface {
	getProfile: (username: string) => Promise<User | null>;
	saveProfile: (profile: User) => Promise<User>;
}
