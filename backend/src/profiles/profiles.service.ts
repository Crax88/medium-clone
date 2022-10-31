import { inject, injectable } from 'inversify';
import { HttpError } from '../errors/httpError';
import { User } from '../users/user.entity';
import { ProfileDto } from './types/profile.dto';
import { ProfilesServiceInterface } from './types/profilesService.interface';
import { ProfilesRepositoryInterface } from './types/profiles.repository.interface';
import { TYPES } from '../types';

@injectable()
export class ProfilesService implements ProfilesServiceInterface {
	constructor(
		@inject(TYPES.ProfilesRepository) private profilesRepository: ProfilesRepositoryInterface,
	) {}

	async getProfile(username: string, userId?: number): Promise<ProfileDto> {
		const profile = await this.profilesRepository.getProfile(username);
		if (!profile) {
			throw new HttpError(404, 'profile not found');
		}
		const profileResponse: ProfileDto['profile'] = {
			username: profile.username,
			image: profile.image,
			bio: profile.bio,
			following: false,
		};
		if (profile.followers) {
			profile.followers.forEach((follower) => {
				if (follower.id === userId) {
					profileResponse.following = true;
				}
			});
		}
		return { profile: profileResponse };
	}

	async followProfile(username: string, userId: number): Promise<ProfileDto> {
		const profile = await this.profilesRepository.getProfile(username);

		if (!profile) {
			throw new HttpError(404, 'profile not found');
		}

		const profileResponse: ProfileDto['profile'] = {
			username: profile.username,
			image: profile.image,
			bio: profile.bio,
			following: false,
		};

		if (profile.id === userId) {
			return { profile: profileResponse };
		}

		if (profile?.followers.find((user) => user.id === userId)) {
			profile.followers = profile.followers.filter((user) => user.id !== userId);
			profileResponse.following = false;
		} else {
			profile?.followers.push({ id: userId } as User);
			profileResponse.following = true;
		}
		await this.profilesRepository.saveProfile(profile);
		return { profile: profileResponse };
	}
}
