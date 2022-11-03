import { inject, injectable } from 'inversify';
import { HttpError } from '../errors/httpError';
import { ProfilesServiceInterface } from './types/profiles.service.interface';
import { ProfilesRepositoryInterface } from './types/profiles.repository.interface';
import { ProfileResponseDto } from './types/profile.dto';
import { TYPES } from '../types';

@injectable()
export class ProfilesService implements ProfilesServiceInterface {
	constructor(
		@inject(TYPES.ProfilesRepository) private profilesRepository: ProfilesRepositoryInterface,
	) {}

	async getProfile(username: string, currentUserId?: number): Promise<ProfileResponseDto> {
		const profile = await this.profilesRepository.getProfile(username, currentUserId);

		if (!profile) {
			throw new HttpError(404, 'profile not found');
		}

		return { profile };
	}

	async followProfile(username: string, currentUserId: number): Promise<ProfileResponseDto> {
		const profile = await this.profilesRepository.getProfile(username, currentUserId);

		if (!profile) {
			throw new HttpError(404, 'profile not found');
		}

		if (profile.following) {
			return { profile };
		}

		await this.profilesRepository.followProfile(username, currentUserId);

		return { profile: { ...profile, following: true } };
	}

	async unfollowProfile(username: string, currentUserId: number): Promise<ProfileResponseDto> {
		const profile = await this.profilesRepository.getProfile(username, currentUserId);

		if (!profile) {
			throw new HttpError(404, 'profile not found');
		}

		if (!profile.following) {
			return { profile };
		}

		await this.profilesRepository.unfollowProfile(username, currentUserId);

		return { profile: { ...profile, following: false } };
	}
}
