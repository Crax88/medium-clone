import 'reflect-metadata';
import { Container } from 'inversify';
import { HttpError } from '../errors/httpError';
import { CommentsService } from './comments.service';
import { ArticlesRepositoryInterface } from '../articles/types/articles.repository.interface';
import { CommentsRepositoryInterface } from './types/comments.repository.interface';
import { CommentsServiceInterface } from './types/commentsService.interface';
import { TYPES } from '../types';

const ArticlesRepositoryMock: ArticlesRepositoryInterface = {
	createArticle: jest.fn(),
	deleteArticle: jest.fn(),
	getArticle: jest.fn(),
	getArticles: jest.fn(),
	saveArticle: jest.fn(),
	updateArticle: jest.fn(),
};

const CommentsRepositoryMock: CommentsRepositoryInterface = {
	createComment: jest.fn(),
	deleteComment: jest.fn(),
	getComment: jest.fn(),
	getComments: jest.fn(),
};

const container = new Container();
let articlesRepository: ArticlesRepositoryInterface;
let commentsRepository: CommentsRepositoryInterface;
let commentsService: CommentsServiceInterface;

beforeAll(() => {
	container
		.bind<ArticlesRepositoryInterface>(TYPES.ArticlesRepository)
		.toConstantValue(ArticlesRepositoryMock);
	container
		.bind<CommentsRepositoryInterface>(TYPES.CommentsRepository)
		.toConstantValue(CommentsRepositoryMock);
	container.bind<CommentsServiceInterface>(TYPES.CommentsService).to(CommentsService);

	articlesRepository = container.get<ArticlesRepositoryInterface>(TYPES.ArticlesRepository);
	commentsRepository = container.get<CommentsRepositoryInterface>(TYPES.CommentsRepository);
	commentsService = container.get<CommentsServiceInterface>(TYPES.CommentsService);
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
			.mockImplementationOnce((dto, userId, articleId) => ({
				id: 1,
				body: dto.body,
				articleId,
				authorId: userId,
				createdAt: new Date().toISOString(),
				updateddAt: new Date().toISOString(),
			}));

		commentsRepository.getComment = jest.fn().mockImplementationOnce((commentId) => ({
			id: commentId,
			body: commentData.body,
			articleId: 1,
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

		const commentResult = await commentsService.createComment(
			'the-title-12345',
			{ comment: commentData },
			1,
		);
		expect(commentResult.comment.body).toEqual(commentData.body);
		expect(commentResult.comment).toHaveProperty('author');
		expect(commentResult.comment.author.bio).toEqual('bio');
		expect(commentResult.comment.author.username).toEqual('user');
		expect(commentResult.comment.author.image).toEqual('someImage');
		expect(commentResult.comment.author.following).toEqual(false);
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

		commentsRepository.deleteComment = jest.fn().mockImplementationOnce((commentId) => ({
			affected: 1,
		}));

		const deleteResult = await commentsService.deleteComment('the-title', 1, 1);
		expect(deleteResult).toBe(undefined);
		expect(articlesRepository.getArticle).toBeCalledTimes(1);
		expect(articlesRepository.getArticle).toBeCalledWith('the-title');
		expect(commentsRepository.deleteComment).toBeCalledTimes(1);
		expect(commentsRepository.deleteComment).toBeCalledWith(1);
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
		commentsRepository.getComments = jest.fn().mockImplementationOnce((articleId) => [
			{
				id: 1,
				body: 'the comment',
				articleId,
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
			},
			{
				id: 2,
				body: 'the comment2',
				articleId,
				authorId: 2,
				author: {
					id: 2,
					username: 'user2',
					email: 'email2@mail.com',
					bio: 'bio2',
					image: 'someImage2',
					followers: [{ id: 1 }],
				},
				createdAt: new Date().toISOString(),
				updateddAt: new Date().toISOString(),
			},
		]);

		const commentsResult = await commentsService.getComments('the-title', 1);
		expect(commentsResult).toHaveProperty('comments');
		expect(commentsResult.comments.length).toBe(2);
		expect(commentsResult.comments[0]).toHaveProperty('author');
		expect(commentsResult.comments[0].author.username).toBeDefined();
		expect(commentsResult.comments[1].author.following).toBe(true);
	});

	it('Get comments, Throws if article not found', async () => {
		articlesRepository.getArticle = jest.fn().mockImplementationOnce((slug) => null);

		expect(async () => {
			await commentsService.getComments('the-title', 1);
		}).rejects.toThrow(HttpError);
	});
});
