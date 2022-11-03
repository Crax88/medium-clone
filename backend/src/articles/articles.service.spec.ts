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
import { UsersRepositoryInterface } from '../users/types/users.repository.interface';

const ArticlesRepositoryMock: ArticlesRepositoryInterface = {
	createArticle: jest.fn(),
	deleteArticle: jest.fn(),
	getArticle: jest.fn(),
	getArticles: jest.fn(),
	updateArticle: jest.fn(),
	favoriteArticle: jest.fn(),
	unfavoriteArticle: jest.fn(),
};

const TagsRepositoryMock: TagsRepositoryInterface = {
	getTag: jest.fn(),
	getTags: jest.fn(),
	saveTag: jest.fn(),
};

const UsersRepositoryMock: UsersRepositoryInterface = {
	createUser: jest.fn(),
	findUser: jest.fn(),
	updateUser: jest.fn(),
};

const container = new Container();
let articlesRepository: ArticlesRepositoryInterface;
let tagsRepository: TagsRepositoryInterface;
let articlesService: ArticlesServiceInterface;
let usersRepository: UsersRepositoryInterface;

beforeAll(() => {
	container.bind<ArticlesServiceInterface>(TYPES.ArticlesService).to(ArticlesService);
	container
		.bind<ArticlesRepositoryInterface>(TYPES.ArticlesRepository)
		.toConstantValue(ArticlesRepositoryMock);
	container.bind<TagsRepositoryInterface>(TYPES.TagsRepository).toConstantValue(TagsRepositoryMock);
	container.bind<TagsServiceInterface>(TYPES.TagsService).to(TagsService);
	container
		.bind<UsersRepositoryInterface>(TYPES.UsersRepository)
		.toConstantValue(UsersRepositoryMock);

	articlesRepository = container.get<ArticlesRepositoryInterface>(TYPES.ArticlesRepository);
	tagsRepository = container.get<TagsRepositoryInterface>(TYPES.TagsRepository);
	articlesService = container.get<ArticlesServiceInterface>(TYPES.ArticlesService);
	usersRepository = container.get<UsersRepositoryInterface>(TYPES.UsersRepository);
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
		let slug = '';
		tagsRepository.getTag = jest.fn().mockImplementationOnce((tagName) => ({
			id: 1,
			tagName,
		}));
		articlesRepository.createArticle = jest.fn().mockImplementationOnce((dto) => {
			slug = dto.slug;
			return {
				...dto,
				id: 1,
			};
		});

		articlesRepository.getArticle = jest.fn().mockImplementationOnce((slug) => ({
			...articleData,
			tagList: ['php', 'java'],
			slug,
			author: {
				username: 'user',
				bio: 'bio',
				image: 'image',
				following: false,
			},
			favorited: false,
			favoritesCount: 0,
		}));

		const articleResult = await articlesService.createArticle(
			{
				article: articleData,
			},
			1,
		);
		expect(articleResult).toHaveProperty('article');
		expect(articleResult.article).toHaveProperty('slug');
		expect(articleResult.article.slug).toEqual(slug);
		expect(articleResult.article).toHaveProperty('title');
		expect(articleResult.article).toHaveProperty('description');
		expect(articleResult.article).toHaveProperty('body');
		expect(articleResult.article).toHaveProperty('author');
		expect(articleResult.article).toHaveProperty('favorited');
		expect(articleResult.article).toHaveProperty('favoritesCount');
		expect(articleResult.article).toHaveProperty('tagList');
		expect(articleResult.article.author).toHaveProperty('username');
		expect(articleResult.article.author).toHaveProperty('bio');
		expect(articleResult.article.author).toHaveProperty('image');
		expect(articleResult.article.author).toHaveProperty('following');
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
					tagList: [],
					authorId: 1,
					author: {
						id: 1,
						username: 'user',
						bio: 'bio',
						image: 'image',
						following: false,
					},
					favorited: false,
					favoritesCount: 0,
				};
			}
			return {
				id: 1,
				...articleData,
				slug: 'new slug',
				tagList: [],
				author: {
					id: 1,
					username: 'user',
					bio: 'bio',
					image: 'image',
					following: false,
				},
				favorited: false,
				favoritesCount: 0,
			};
		});
		articlesRepository.updateArticle = jest.fn().mockImplementationOnce((articleId, dto) => ({
			affected: 1,
		}));
		usersRepository.findUser = jest.fn().mockImplementationOnce(() => ({
			username: 'user',
			bio: 'bio',
			image: 'image',
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
		expect(articleResult).toHaveProperty('article');
		expect(articleResult.article).toHaveProperty('slug');
		expect(articleResult.article).toHaveProperty('title');
		expect(articleResult.article).toHaveProperty('description');
		expect(articleResult.article).toHaveProperty('body');
		expect(articleResult.article).toHaveProperty('author');
		expect(articleResult.article).toHaveProperty('favorited');
		expect(articleResult.article).toHaveProperty('favoritesCount');
		expect(articleResult.article).toHaveProperty('tagList');
		expect(articleResult.article.author).toHaveProperty('username');
		expect(articleResult.article.author).toHaveProperty('bio');
		expect(articleResult.article.author).toHaveProperty('image');
		expect(articleResult.article.author).toHaveProperty('following');
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
		usersRepository.findUser = jest.fn().mockImplementationOnce(() => ({
			username: 'user',
			bio: 'bio',
			image: 'image',
		}));

		const articleResult = await articlesService.deleteArticle('the-slug', 1);
		expect(articlesRepository.deleteArticle).toHaveBeenCalledTimes(1);
		expect(articlesRepository.deleteArticle).toHaveBeenCalledWith('the-slug');
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
						following: false,
					},
					favorited: false,
					favoritesCount: 0,
					tagList: [],
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
						following: false,
					},
					favorited: false,
					favoritesCount: 0,
					tagList: [],
				},
			],
			articlesCount: 2,
		}));

		const articlesResult = await articlesService.getArticles({}, 1);

		expect(articlesResult).toHaveProperty('articles');
		expect(articlesResult).toHaveProperty('articlesCount');
		expect(articlesResult.articles[0]).toHaveProperty('slug');
		expect(articlesResult.articles[0]).toHaveProperty('title');
		expect(articlesResult.articles[0]).toHaveProperty('description');
		expect(articlesResult.articles[0]).toHaveProperty('body');
		expect(articlesResult.articles[0]).toHaveProperty('author');
		expect(articlesResult.articles[0]).toHaveProperty('favorited');
		expect(articlesResult.articles[0]).toHaveProperty('favoritesCount');
		expect(articlesResult.articles[0]).toHaveProperty('tagList');
		expect(articlesResult.articles[0].author).toHaveProperty('username');
		expect(articlesResult.articles[0].author).toHaveProperty('bio');
		expect(articlesResult.articles[0].author).toHaveProperty('image');
		expect(articlesResult.articles[0].author).toHaveProperty('following');
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
					author: {
						id: 2,
						username: 'user',
						bio: 'bio',
						image: 'image',
						following: false,
					},
					favoritesCount: 0,
					favorited: false,
					tagList: [],
				},
				{
					id: 2,
					title: 'title2',
					description: 'description2',
					body: 'body2',
					slug: 'slug2',
					author: {
						id: 2,
						username: 'user',
						bio: 'bio',
						image: 'image',
						following: false,
					},
					favoritesCount: 0,
					favorited: false,
					tagList: [],
				},
			],
			articlesCount: 2,
		}));

		const articlesResult = await articlesService.getFeed({}, 1);

		expect(articlesResult).toHaveProperty('articles');
		expect(articlesResult).toHaveProperty('articlesCount');
		expect(articlesResult.articles[0]).toHaveProperty('slug');
		expect(articlesResult.articles[0]).toHaveProperty('title');
		expect(articlesResult.articles[0]).toHaveProperty('description');
		expect(articlesResult.articles[0]).toHaveProperty('body');
		expect(articlesResult.articles[0]).toHaveProperty('author');
		expect(articlesResult.articles[0]).toHaveProperty('favorited');
		expect(articlesResult.articles[0]).toHaveProperty('favoritesCount');
		expect(articlesResult.articles[0]).toHaveProperty('tagList');
		expect(articlesResult.articles[0].author).toHaveProperty('username');
		expect(articlesResult.articles[0].author).toHaveProperty('bio');
		expect(articlesResult.articles[0].author).toHaveProperty('image');
		expect(articlesResult.articles[0].author).toHaveProperty('following');
	});

	it('Get article', async () => {
		articlesRepository.getArticle = jest.fn().mockImplementationOnce(() => ({
			id: 1,
			title: 'title1',
			description: 'description1',
			body: 'body1',
			slug: 'slug1',
			author: {
				id: 2,
				username: 'user',
				bio: 'bio',
				image: 'image',
				following: false,
			},
			favoritesCount: 0,
			favorited: false,
			tagList: [],
		}));

		const searchSlug = 'slug1';
		const articleResult = await articlesService.getArticle(searchSlug, 1);

		expect(articleResult).toHaveProperty('article');
		expect(articleResult.article.slug).toEqual(searchSlug);
		expect(articleResult.article).toHaveProperty('title');
		expect(articleResult.article).toHaveProperty('description');
		expect(articleResult.article).toHaveProperty('body');
		expect(articleResult.article).toHaveProperty('author');
		expect(articleResult.article).toHaveProperty('favorited');
		expect(articleResult.article).toHaveProperty('favoritesCount');
		expect(articleResult.article).toHaveProperty('tagList');
		expect(articleResult.article.author).toHaveProperty('username');
		expect(articleResult.article.author).toHaveProperty('bio');
		expect(articleResult.article.author).toHaveProperty('image');
		expect(articleResult.article.author).toHaveProperty('following');
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
				following: false,
			},
			favoritesCount: 0,
			favorited: false,
			tagList: [],
		};

		articlesRepository.getArticle = jest.fn().mockImplementation(() => {
			return savedArticle;
		});

		const favoriteResult = await articlesService.favoriteArticle('slug1', 1);

		expect(favoriteResult).toHaveProperty('article');
		expect(favoriteResult.article.favoritesCount).toEqual(1);
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
				following: false,
			},
			favoritesCount: 1,
			favorited: true,
			tagList: [],
		};

		articlesRepository.getArticle = jest.fn().mockImplementationOnce(() => {
			return savedArticle;
		});

		const favoriteResult = await articlesService.unfavoriteArticle('slug1', 1);
		console.log(favoriteResult);
		expect(favoriteResult).toHaveProperty('article');
		expect(favoriteResult.article.favoritesCount).toEqual(0);
		expect(favoriteResult.article.favorited).toEqual(false);
	});

	it('Favorite article, Throws if article not found', () => {
		articlesRepository.getArticle = jest.fn().mockImplementationOnce((slug) => null);

		expect(async () => {
			await articlesService.favoriteArticle('slug', 1);
		}).rejects.toThrow(HttpError);
	});
});
