import 'reflect-metadata';

import { Container } from 'inversify';

import { ArticlesRepositoryInterface } from '../articles/types/articles.repository.interface';
import { HttpError } from '../errors/httpError';
import { TYPES } from '../types';
import { UsersRepositoryInterface } from '../users/types/users.repository.interface';

import { CommentsRepositoryInterface } from './types/comments.repository.interface';
import { CommentsServiceInterface } from './types/comments.service.interface';
import { CommentsService } from './comments.service';

const ArticlesRepositoryMock: ArticlesRepositoryInterface = {
	createArticle: jest.fn(),
	deleteArticle: jest.fn(),
	getArticle: jest.fn(),
	getArticles: jest.fn(),
	updateArticle: jest.fn(),
	favoriteArticle: jest.fn(),
	unfavoriteArticle: jest.fn(),
};

const CommentsRepositoryMock: CommentsRepositoryInterface = {
	createComment: jest.fn(),
	deleteComment: jest.fn(),
	getComment: jest.fn(),
	getComments: jest.fn(),
	getCommentLast: jest.fn(),
};

const UsersRepositoryMock: UsersRepositoryInterface = {
	createUser: jest.fn(),
	findUser: jest.fn(),
	updateUser: jest.fn(),
};

const container = new Container();
let articlesRepository: ArticlesRepositoryInterface;
let commentsRepository: CommentsRepositoryInterface;
let commentsService: CommentsServiceInterface;
let usersRepository: UsersRepositoryInterface;

beforeAll(() => {
	container
		.bind<ArticlesRepositoryInterface>(TYPES.ArticlesRepository)
		.toConstantValue(ArticlesRepositoryMock);
	container
		.bind<CommentsRepositoryInterface>(TYPES.CommentsRepository)
		.toConstantValue(CommentsRepositoryMock);
	container.bind<CommentsServiceInterface>(TYPES.CommentsService).to(CommentsService);
	container
		.bind<UsersRepositoryInterface>(TYPES.UsersRepository)
		.toConstantValue(UsersRepositoryMock);

	articlesRepository = container.get<ArticlesRepositoryInterface>(TYPES.ArticlesRepository);
	commentsRepository = container.get<CommentsRepositoryInterface>(TYPES.CommentsRepository);
	commentsService = container.get<CommentsServiceInterface>(TYPES.CommentsService);
	usersRepository = container.get<UsersRepositoryInterface>(TYPES.UsersRepository);
});

describe('CommentsService', () => {
	it('Create comment', async () => {
		const commentData = { body: 'The Comment' };
		articlesRepository.getArticle = jest.fn().mockImplementationOnce((slug) => ({
			id: 1,
			slug: slug,
			description: 'description',
			body: 'mega body',
		}));
		commentsRepository.createComment = jest
			.fn()
			.mockImplementationOnce((dto, userId, articleId) => {
				return;
			});

		commentsRepository.getCommentLast = jest.fn().mockImplementationOnce((slug, userId) => ({
			id: 1,
			body: commentData.body,
			author: {
				username: 'user',
				bio: 'bio',
				image: 'someImage',
				following: false,
			},
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}));

		const commentResult = await commentsService.createComment(
			'the-title-12345',
			{ comment: commentData },
			1,
		);
		expect(commentResult).toHaveProperty('comment');
		expect(commentResult.comment).toHaveProperty('id');
		expect(commentResult.comment).toHaveProperty('body');
		expect(commentResult.comment).toHaveProperty('createdAt');
		expect(commentResult.comment).toHaveProperty('updatedAt');
		expect(commentResult.comment).toHaveProperty('author');
		expect(commentResult.comment.author).toHaveProperty('username');
		expect(commentResult.comment.author).toHaveProperty('image');
		expect(commentResult.comment.author).toHaveProperty('bio');
		expect(commentResult.comment.author).toHaveProperty('following');
		expect(commentResult.comment.body).toEqual(commentData.body);
	});

	it('Create comment, Throws if article not found', async () => {
		articlesRepository.getArticle = jest.fn().mockImplementationOnce((slug) => null);

		expect(async () => {
			await commentsService.createComment('the-title', { comment: { body: 'comment' } }, 1);
		}).rejects.toThrow(HttpError);
	});

	it('Delete comment', async () => {
		articlesRepository.getArticle = jest.fn().mockImplementationOnce((slug) => ({
			id: 1,
			slug: slug,
			description: 'description',
			body: 'mega body',
		}));

		commentsRepository.getComment = jest.fn().mockImplementationOnce((commentId) => ({
			id: commentId,
			body: 'the comment',
			author: {
				username: 'user',
				bio: 'bio',
				image: 'someImage',
				following: false,
			},
			createdAt: new Date().toISOString(),
			updateddAt: new Date().toISOString(),
		}));

		usersRepository.findUser = jest.fn().mockImplementationOnce(() => ({
			username: 'user',
			bio: 'bio',
			image: 'image',
		}));

		commentsRepository.deleteComment = jest.fn().mockImplementationOnce((commentId) => ({
			affected: 1,
		}));

		await commentsService.deleteComment('the-title', 1, 1);

		expect(commentsRepository.deleteComment).toBeCalledTimes(1);
	});

	it('Delete comment, Throws if article not found', async () => {
		articlesRepository.getArticle = jest.fn().mockImplementationOnce((slug) => null);

		expect(async () => {
			await commentsService.deleteComment('the-title', 1, 1);
		}).rejects.toThrow(HttpError);
	});

	it('Delete comment, Throws if comment not found', async () => {
		articlesRepository.getArticle = jest.fn().mockImplementationOnce((slug) => ({
			id: 1,
			slug: slug,
			description: 'description',
			body: 'mega body',
		}));
		commentsRepository.getComment = jest.fn().mockImplementationOnce((commentId) => null);

		expect(async () => {
			await commentsService.deleteComment('the-title', 1, 1);
		}).rejects.toThrow(HttpError);
	});

	it('Delete comment, Throws if user is not comment author', async () => {
		articlesRepository.getArticle = jest.fn().mockImplementationOnce((slug) => ({
			id: 1,
			slug: slug,
			description: 'description',
			body: 'mega body',
		}));
		commentsRepository.getComment = jest.fn().mockImplementationOnce((commentId) => ({
			id: commentId,
			body: 'the comment',
			articleId: 1,
			authorId: 1,
			author: {
				id: 1,
				username: 'user',
				email: 'email@mail.com',
				bio: 'bio',
				image: 'someImage',
				followers: [],
			},
			createdAt: new Date().toISOString(),
			updateddAt: new Date().toISOString(),
		}));

		expect(async () => {
			await commentsService.deleteComment('the-title', 1, 2);
		}).rejects.toThrow(HttpError);
	});

	it('Get comments', async () => {
		articlesRepository.getArticle = jest.fn().mockImplementationOnce((slug) => ({
			id: 1,
			slug: slug,
			description: 'description',
			body: 'mega body',
		}));
		commentsRepository.getComments = jest.fn().mockImplementationOnce((slug, userId) => [
			{
				id: 1,
				body: 'the comment',
				author: {
					username: 'user',
					email: 'email@mail.com',
					bio: 'bio',
					image: 'someImage',
					following: false,
				},
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			{
				id: 2,
				body: 'the comment2',
				author: {
					username: 'user2',
					bio: 'bio2',
					image: 'someImage2',
					following: false,
				},
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
		]);

		const commentsResult = await commentsService.getComments('the-title', 1);
		expect(commentsResult).toHaveProperty('comments');
		expect(commentsResult.comments[0]).toHaveProperty('id');
		expect(commentsResult.comments[0]).toHaveProperty('body');
		expect(commentsResult.comments[0]).toHaveProperty('createdAt');
		expect(commentsResult.comments[0]).toHaveProperty('updatedAt');
		expect(commentsResult.comments[0]).toHaveProperty('author');
		expect(commentsResult.comments[0].author).toHaveProperty('username');
		expect(commentsResult.comments[0].author).toHaveProperty('image');
		expect(commentsResult.comments[0].author).toHaveProperty('bio');
		expect(commentsResult.comments[0].author).toHaveProperty('following');
	});

	it('Get comments, Throws if article not found', async () => {
		articlesRepository.getArticle = jest.fn().mockImplementationOnce((slug) => null);

		expect(async () => {
			await commentsService.getComments('the-title', 1);
		}).rejects.toThrow(HttpError);
	});
});
