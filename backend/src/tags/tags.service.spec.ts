import 'reflect-metadata';
import { Container } from 'inversify';
import { TagsService } from './tags.service';
import { TagsRepositoryInterface } from './types/tags.repository.interface';
import { TagsServiceInterface } from './types/tags.service.interface';
import { TYPES } from '../types';

const TagsRepositoryMock: TagsRepositoryInterface = {
	getTag: jest.fn(),
	getTags: jest.fn(),
	saveTag: jest.fn(),
};

const container = new Container();
let tagsRepository: TagsRepositoryInterface;
let tagsService: TagsServiceInterface;

beforeAll(() => {
	container.bind<TagsRepositoryInterface>(TYPES.TagsRepository).toConstantValue(TagsRepositoryMock);
	container.bind<TagsServiceInterface>(TYPES.TagsService).to(TagsService);

	tagsRepository = container.get<TagsRepositoryInterface>(TYPES.TagsRepository);
	tagsService = container.get<TagsServiceInterface>(TYPES.TagsService);
});

describe('TagsService', () => {
	it('Creates new tag', async () => {
		tagsRepository.getTag = jest.fn().mockImplementationOnce((tag) => null);
		tagsRepository.saveTag = jest.fn().mockImplementationOnce((tag) => ({
			id: 1,
			tagName: tag,
		}));

		const createResult = await tagsService.saveTag('javascript');
		expect(createResult.tagName).toEqual('javascript');
	});

	it('Get tags', async () => {
		tagsRepository.getTags = jest.fn().mockImplementationOnce(() => [
			{
				id: 1,
				tagName: 'javascript',
			},
			{
				id: 2,
				tagName: 'php',
			},
		]);

		const tagsResult = await tagsService.getPopularTags();
		expect(tagsResult.length).toBe(2);
	});

	it('Creates tags response', () => {
		const tagsResult = tagsService.buildPopularTagsResponse([
			{ id: 1, tagName: 'javascript' },
			{ id: 2, tagName: 'php' },
		]);

		expect(tagsResult).toHaveProperty('tags');
		expect(tagsResult.tags.length).toBe(2);
	});
});
