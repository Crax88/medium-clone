import 'reflect-metadata';
import { Container } from 'inversify';
import { ArticlesService } from './articles.service';
import { ArticlesRepositoryInterface } from './types/articles.repository.interface';
import { TagsRepositoryInterface } from '../tags/types/tags.repository.interface';
import { ArticlesServiceInterface } from './types/articles.service.interface';
import { TYPES } from '../types';
import { TagsServiceInterface } from '../tags/types/tags.service.interface';
import { TagsService } from '../tags/tags.service';
import { HttpError } from '../errors/httpError';

const ArticlesRepositoryMock: ArticlesRepositoryInterface = {
	createArticle: jest.fn(),
	deleteArticle: jest.fn(),
	getArticle: jest.fn(),
	getArticles: jest.fn(),
	saveArticle: jest.fn(),
	updateArticle: jest.fn(),
};

const TagsRepositoryMock: TagsRepositoryInterface = {
	getTag: jest.fn(),
	getTags: jest.fn(),
	saveTag: jest.fn(),
};

const container = new Container();
let articlesRepository: ArticlesRepositoryInterface;
let tagsRepository: TagsRepositoryInterface;
let articlesService: ArticlesServiceInterface;

beforeAll(() => {
	container.bind<ArticlesServiceInterface>(TYPES.ArticlesService).to(ArticlesService);
	container
		.bind<ArticlesRepositoryInterface>(TYPES.ArticlesRepository)
		.toConstantValue(ArticlesRepositoryMock);
	container.bind<TagsRepositoryInterface>(TYPES.TagsRepository).toConstantValue(TagsRepositoryMock);
	container.bind<TagsServiceInterface>(TYPES.TagsService).to(TagsService);

	articlesRepository = container.get<ArticlesRepositoryInterface>(TYPES.ArticlesRepository);
	tagsRepository = container.get<TagsRepositoryInterface>(TYPES.TagsRepository);
	articlesService = container.get<ArticlesServiceInterface>(TYPES.ArticlesService);
});

beforeEach(() => {
	jest.clearAllMocks();
});

describe('ArticlesService', () => {
	it('Create new article', async () => {
		const articleData = {
			body: 'body',
			title: 'title',
			description: 'description',
			tagList: ['javascript'],
		};
		tagsRepository.getTag = jest.fn().mockImplementationOnce((tagName) => ({
			id: 1,
			tagName,
		}));
		articlesRepository.createArticle = jest.fn().mockImplementationOnce((dto) => ({
			...dto,
			id: 1,
		}));

		articlesRepository.getArticle = jest.fn().mockImplementationOnce((slug) => ({
			...articleData,
			tags: [{ id: 1, tagName: 'javascript' }],
			id: 1,
			favorite: [],
			author: {
				id: 1,
				username: 'user',
				bio: 'bio',
				image: 'image',
			},
		}));

		const articleResult = await articlesService.createArticle(
			{
				article: articleData,
			},
			1,
		);
		expect(articlesRepository.createArticle).toHaveBeenCalledTimes(1);
		expect(articleResult).toHaveProperty('article');
		expect(articleResult.article.slug).not.toEqual(articleData.title);
		expect(articleResult.article.title).toEqual(articleData.title);
		expect(articleResult.article.description).toEqual(articleData.description);
		expect(articleResult.article.body).toEqual(articleData.body);
		expect(articleResult.article).toHaveProperty('author');
		expect(articleResult.article.author.username).toEqual('user');
		expect(articleResult.article.favorited).toEqual(false);
		expect(articleResult.article.favoritesCount).toEqual(0);
	});

	it('Update article', async () => {
		const articleData = {
			body: 'body',
			title: 'title',
			description: 'description',
			tagList: ['javascript'],
		};
		articlesRepository.getArticle = jest.fn().mockImplementation((slug) => {
			if (slug === 'the-slug') {
				return {
					id: 1,
					title: 'prev title',
					description: 'prev description',
					body: 'prev body',
					slug: 'the-slug',
					authorId: 1,
					author: {
						id: 1,
						username: 'user',
						bio: 'bio',
						image: 'image',
					},
					favorite: [],
					tags: [{ id: 1, tagName: 'php' }],
				};
			}
			return {
				id: 1,
				...articleData,
				slug: 'new slug',
				author: {
					id: 1,
					username: 'user',
					bio: 'bio',
					image: 'image',
				},
				favorite: [],
				tags: [{ id: 1, tagName: 'php' }],
			};
		});
		articlesRepository.updateArticle = jest.fn().mockImplementationOnce((articleId, dto) => ({
			affected: 1,
		}));

		const articleResult = await articlesService.updateArticle(
			'the-slug',
			{
				article: {
					body: articleData.body,
					title: articleData.title,
					description: articleData.description,
				},
			},
			1,
		);
		expect(articlesRepository.updateArticle).toHaveBeenCalledTimes(1);
		expect(articleResult).toHaveProperty('article');
		expect(articleResult.article.slug).not.toEqual(articleData.title);
		expect(articleResult.article.title).not.toEqual('the-slug');
		expect(articleResult.article.description).toEqual(articleData.description);
		expect(articleResult.article.body).toEqual(articleData.body);
		expect(articleResult.article).toHaveProperty('author');
		expect(articleResult.article.author.username).toEqual('user');
		expect(articleResult.article.favorited).toEqual(false);
		expect(articleResult.article.favoritesCount).toEqual(0);
	});

	it('Update article, Throws if article not found', () => {
		articlesRepository.getArticle = jest.fn().mockImplementationOnce((slug) => null);
		const articleData = {
			body: 'new body',
			title: 'new title',
			description: 'new description',
		};
		expect(async () => {
			await articlesService.updateArticle('title', { article: articleData }, 1);
		}).rejects.toThrow(HttpError);
	});

	it('Update article, Throws if user is not the author', () => {
		articlesRepository.getArticle = jest.fn().mockImplementationOnce((slug) => ({
			body: 'body',
			title: 'title',
			description: 'description',
			tags: [{ id: 1, tagName: 'javascript' }],
			id: 1,
			favorite: [],
			author: {
				id: 2,
				username: 'user',
				bio: 'bio',
				image: 'image',
			},
		}));
		const articleData = {
			body: 'new body',
			title: 'new title',
			description: 'new description',
		};
		expect(async () => {
			await articlesService.updateArticle('title', { article: articleData }, 1);
		}).rejects.toThrow(HttpError);
	});

	it('Delete article', async () => {
		articlesRepository.getArticle = jest.fn().mockImplementationOnce((slug) => {
			return {
				id: 1,
				title: 'prev title',
				description: 'prev description',
				body: 'prev body',
				slug: 'the-slug',
				authorId: 1,
				author: {
					id: 1,
					username: 'user',
					bio: 'bio',
					image: 'image',
				},
				favorite: [],
				tags: [{ id: 1, tagName: 'php' }],
			};
		});
		articlesRepository.deleteArticle = jest.fn().mockImplementationOnce((articleId) => ({
			affected: 1,
		}));

		const articleResult = await articlesService.deleteArticle('the-slug', 1);
		expect(articlesRepository.deleteArticle).toHaveBeenCalledTimes(1);
		expect(articlesRepository.deleteArticle).toHaveBeenCalledWith(1);
		expect(articleResult).toBeUndefined();
	});

	it('Delete article, Throws if article not found', () => {
		articlesRepository.getArticle = jest.fn().mockImplementationOnce((slug) => null);

		expect(async () => {
			await articlesService.deleteArticle('slug', 1);
		}).rejects.toThrow(HttpError);
	});

	it('Update article, Throws if user is not the author', () => {
		articlesRepository.getArticle = jest.fn().mockImplementationOnce((slug) => ({
			body: 'body',
			title: 'title',
			description: 'description',
			tags: [{ id: 1, tagName: 'javascript' }],
			id: 1,
			favorite: [],
			author: {
				id: 2,
				username: 'user',
				bio: 'bio',
				image: 'image',
			},
		}));

		expect(async () => {
			await articlesService.deleteArticle('slug', 1);
		}).rejects.toThrow(HttpError);
	});

	it('Get articles', async () => {
		articlesRepository.getArticles = jest.fn().mockImplementationOnce(() => ({
			articles: [
				{
					id: 1,
					title: 'title1',
					description: 'description1',
					body: 'body1',
					slug: 'slug1',
					authorId: 1,
					author: {
						id: 1,
						username: 'user',
						bio: 'bio',
						image: 'image',
					},
					favorite: [{ id: 3 }, { id: 4 }],
					tags: [{ id: 1, tagName: 'php' }],
				},
				{
					id: 2,
					title: 'title2',
					description: 'description2',
					body: 'body2',
					slug: 'slug2',
					authorId: 2,
					author: {
						id: 2,
						username: 'user2',
						bio: 'bio2',
						image: 'image2',
					},
					favorite: [{ id: 1 }],
					tags: [{ id: 1, tagName: 'php' }],
				},
			],
			articlesCount: 2,
		}));

		const articlesResult = await articlesService.getArticles({}, 1);

		expect(articlesResult).toHaveProperty('articles');
		expect(articlesResult).toHaveProperty('articlesCount');
		expect(articlesResult.articlesCount).toEqual(2);
		expect(articlesResult.articles.length).toEqual(2);
		expect(articlesResult.articles.length).toEqual(2);
		expect(articlesResult.articles[0].favorited).toEqual(false);
		expect(articlesResult.articles[0].favoritesCount).toEqual(2);
		expect(articlesResult.articles[1].favorited).toEqual(true);
		expect(articlesResult.articles[1].favoritesCount).toEqual(1);
	});

	it('Get feed', async () => {
		articlesRepository.getArticles = jest.fn().mockImplementationOnce(() => ({
			articles: [
				{
					id: 1,
					title: 'title1',
					description: 'description1',
					body: 'body1',
					slug: 'slug1',
					authorId: 1,
					author: {
						id: 1,
						username: 'user',
						bio: 'bio',
						image: 'image',
						followers: [{ id: 1 }],
					},
					favorite: [{ id: 3 }, { id: 4 }],
					tags: [{ id: 1, tagName: 'php' }],
				},
				{
					id: 2,
					title: 'title2',
					description: 'description2',
					body: 'body2',
					slug: 'slug2',
					authorId: 2,
					author: {
						id: 2,
						username: 'user2',
						bio: 'bio2',
						image: 'image2',
						followers: [],
					},
					favorite: [{ id: 1 }],
					tags: [{ id: 1, tagName: 'php' }],
				},
			],
			articlesCount: 2,
		}));

		const articlesResult = await articlesService.getFeed({}, 1);

		expect(articlesResult).toHaveProperty('articles');
		expect(articlesResult).toHaveProperty('articlesCount');
		expect(articlesResult.articlesCount).toEqual(1);
		expect(articlesResult.articles.length).toEqual(1);
		expect(articlesResult.articles.length).toEqual(1);
		expect(articlesResult.articles[0].favorited).toEqual(false);
		expect(articlesResult.articles[0].favoritesCount).toEqual(2);
	});

	it('Get article', async () => {
		articlesRepository.getArticle = jest.fn().mockImplementationOnce(() => ({
			id: 1,
			title: 'title1',
			description: 'description1',
			body: 'body1',
			slug: 'slug1',
			authorId: 2,
			author: {
				id: 2,
				username: 'user',
				bio: 'bio',
				image: 'image',
			},
			favorite: [{ id: 1 }, { id: 4 }],
			tags: [{ id: 1, tagName: 'php' }],
		}));

		const searchSlug = 'slug1';
		const articlesResult = await articlesService.getArticle(searchSlug, 1);

		expect(articlesResult).toHaveProperty('article');
		expect(articlesResult.article.slug).toEqual(searchSlug);
		expect(articlesResult.article.favorited).toEqual(true);
		expect(articlesResult.article.favoritesCount).toEqual(2);
	});

	it('Get article, Throws if article not found', () => {
		articlesRepository.getArticle = jest.fn().mockImplementationOnce((slug) => null);

		expect(async () => {
			await articlesService.getArticle('slug', 1);
		}).rejects.toThrow(HttpError);
	});

	it('Favorite article', async () => {
		const savedArticle = {
			id: 1,
			title: 'title1',
			description: 'description1',
			body: 'body1',
			slug: 'slug1',
			authorId: 2,
			author: {
				id: 2,
				username: 'user',
				bio: 'bio',
				image: 'image',
			},
			favorite: [{ id: 5 }],
			tags: [{ id: 1, tagName: 'php' }],
		};

		articlesRepository.getArticle = jest.fn().mockImplementation(() => {
			return savedArticle;
		});

		const favoriteResult = await articlesService.favoriteArticle('slug1', 1);

		expect(favoriteResult).toHaveProperty('article');
		expect(favoriteResult.article.favoritesCount).toEqual(2);
		expect(favoriteResult.article.favorited).toEqual(true);
	});

	it('Unfavorite article', async () => {
		const savedArticle = {
			id: 1,
			title: 'title1',
			description: 'description1',
			body: 'body1',
			slug: 'slug1',
			authorId: 2,
			author: {
				id: 2,
				username: 'user',
				bio: 'bio',
				image: 'image',
			},
			favorite: [{ id: 5 }, { id: 1 }],
			tags: [{ id: 1, tagName: 'php' }],
		};

		articlesRepository.getArticle = jest.fn().mockImplementation(() => {
			return savedArticle;
		});

		const favoriteResult = await articlesService.favoriteArticle('slug1', 1);

		expect(favoriteResult).toHaveProperty('article');
		expect(favoriteResult.article.favoritesCount).toEqual(1);
		expect(favoriteResult.article.favorited).toEqual(false);
	});

	it('Favorite article, Throws if article not found', () => {
		articlesRepository.getArticle = jest.fn().mockImplementationOnce((slug) => null);

		expect(async () => {
			await articlesService.favoriteArticle('slug', 1);
		}).rejects.toThrow(HttpError);
	});
});
