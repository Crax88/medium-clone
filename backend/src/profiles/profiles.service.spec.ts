import 'reflect-metadata';
import { Container } from 'inversify';
import { HttpError } from '../errors/httpError';
import { ProfilesService } from './profiles.service';
import { ProfilesRepositoryInterface } from './types/profiles.repository.interface';
import { ProfilesServiceInterface } from './types/profiles.service.interface';
import { TYPES } from '../types';

const ProfilesRepositoryMock: ProfilesRepositoryInterface = {
	getProfile: jest.fn(),
	followProfile: jest.fn(),
	unfollowProfile: jest.fn(),
};

const container = new Container();
let profilesRepository: ProfilesRepositoryInterface;
let profilesService: ProfilesServiceInterface;

beforeAll(() => {
	container
		.bind<ProfilesRepositoryInterface>(TYPES.ProfilesRepository)
		.toConstantValue(ProfilesRepositoryMock);
	container.bind<ProfilesServiceInterface>(TYPES.ProfilesService).to(ProfilesService);

	profilesRepository = container.get<ProfilesRepositoryInterface>(TYPES.ProfilesRepository);
	profilesService = container.get<ProfilesServiceInterface>(TYPES.ProfilesService);
});

describe('ProfilesService', () => {
	it('Finds profile, no following', async () => {
		profilesRepository.getProfile = jest.fn().mockImplementationOnce((username) => ({
			id: 1,
			bio: 'bio',
			image: 'http://pics.com/1',
			username: username,
			following: false,
		}));

		const profileName = 'user';
		const profileResult = await profilesService.getProfile(profileName);
		expect(profileResult.profile.username).toEqual('user');
		expect(profileResult.profile.bio).toEqual('bio');
		expect(profileResult.profile.image).toEqual('http://pics.com/1');
		expect(profileResult.profile.following).toEqual(false);
		expect(profileResult.profile).not.toHaveProperty('password');
	});

	it('Finds profile, with following', async () => {
		profilesRepository.getProfile = jest.fn().mockImplementationOnce((username) => ({
			id: 1,
			bio: 'bio',
			image: 'http://pics.com/1',
			username: username,
			following: true,
		}));

		const profileName = 'user';
		const profileResult = await profilesService.getProfile(profileName, 2);
		expect(profileResult).toHaveProperty('profile');
		expect(profileResult.profile.username).toEqual('user');
		expect(profileResult.profile.bio).toEqual('bio');
		expect(profileResult.profile.image).toEqual('http://pics.com/1');
		expect(profileResult.profile.following).toEqual(true);
		expect(profileResult.profile).not.toHaveProperty('password');
	});

	it('Finds profile, Throws if profile not found', async () => {
		profilesRepository.getProfile = jest.fn().mockImplementationOnce((username) => null);

		expect(async () => {
			await profilesService.getProfile('user', 1);
		}).rejects.toThrow(HttpError);
	});

	it('Follows profile', async () => {
		profilesRepository.getProfile = jest.fn().mockImplementationOnce((username) => ({
			id: 1,
			bio: 'bio',
			image: 'http://pics.com/1',
			username: username,
			following: false,
		}));

		profilesRepository.followProfile = jest
			.fn()
			.mockImplementationOnce((profileName, followerId) => {
				return;
			});

		const profileName = 'user';
		const profileResult = await profilesService.followProfile(profileName, 2);
		expect(profileResult).toHaveProperty('profile');
		expect(profileResult.profile.username).toEqual('user');
		expect(profileResult.profile.bio).toEqual('bio');
		expect(profileResult.profile.image).toEqual('http://pics.com/1');
		expect(profileResult.profile.following).toEqual(true);
		expect(profileResult.profile).not.toHaveProperty('password');
	});

	it('Follows profile, Throws if profile not found', async () => {
		profilesRepository.getProfile = jest.fn().mockImplementationOnce((username) => null);

		expect(async () => {
			await profilesService.followProfile('user', 1);
		}).rejects.toThrow(HttpError);
	});

	it('Unfollows profile', async () => {
		profilesRepository.getProfile = jest.fn().mockImplementationOnce((username) => ({
			id: 1,
			bio: 'bio',
			image: 'http://pics.com/1',
			username: username,
			following: true,
		}));

		profilesRepository.unfollowProfile = jest
			.fn()
			.mockImplementationOnce((profileName, followerId) => {
				return;
			});

		const profileName = 'user';
		const profileResult = await profilesService.unfollowProfile(profileName, 2);
		expect(profileResult).toHaveProperty('profile');
		expect(profileResult.profile.username).toEqual('user');
		expect(profileResult.profile.bio).toEqual('bio');
		expect(profileResult.profile.image).toEqual('http://pics.com/1');
		expect(profileResult.profile.following).toEqual(false);
		expect(profileResult.profile).not.toHaveProperty('password');
	});

	it('Unfollows profile, Throws if profile not found', async () => {
		profilesRepository.getProfile = jest.fn().mockImplementationOnce((username) => null);

		expect(async () => {
			await profilesService.followProfile('user', 1);
		}).rejects.toThrow(HttpError);
	});
});
