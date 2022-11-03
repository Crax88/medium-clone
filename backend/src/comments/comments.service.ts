import { inject, injectable } from 'inversify';
import { HttpError } from '../errors/httpError';
import { CommentsServiceInterface } from './types/comments.service.interface';
import { CommentsRepositoryInterface } from './types/comments.repository.interface';
import { ArticlesRepositoryInterface } from '../articles/types/articles.repository.interface';
import { UsersRepositoryInterface } from '../users/types/users.repository.interface';
import { CommentResponseDto, CommentsResponseDto } from './types/comment.dto';
import { CreateCommentRequestDto } from './types/createComment.dto';
import { TYPES } from '../types';

@injectable()
export class CommentsService implements CommentsServiceInterface {
	constructor(
		@inject(TYPES.ArticlesRepository) private articlesRepository: ArticlesRepositoryInterface,
		@inject(TYPES.CommentsRepository) private commentsRepository: CommentsRepositoryInterface,
		@inject(TYPES.UsersRepository) private usersRepository: UsersRepositoryInterface,
	) {}
	async createComment(
		slug: string,
		{ comment }: CreateCommentRequestDto,
		userId: number,
	): Promise<CommentResponseDto> {
		const article = await this.articlesRepository.getArticle(slug);
		if (!article) {
			throw new HttpError(404, 'article not found');
		}
		await this.commentsRepository.createComment(comment, userId, slug);
		const savedComment = await this.commentsRepository.getCommentLast(slug, userId);
		if (!savedComment) {
			throw new HttpError(404, 'comment not found');
		}
		return {
			comment: savedComment,
		};
	}

	async deleteComment(slug: string, commentId: number, userId: number): Promise<void> {
		const article = await this.articlesRepository.getArticle(slug);
		if (!article) {
			throw new HttpError(401, 'article not found');
		}
		const comment = await this.commentsRepository.getComment(commentId);
		if (!comment) {
			throw new HttpError(404, 'comment not found');
		}
		const user = await this.usersRepository.findUser({ id: userId });
		if (!user) {
			throw new HttpError(404, 'user not found');
		}
		if (comment.author.username !== user.username) {
			throw new HttpError(403, "can't delete others comment");
		}
		await this.commentsRepository.deleteComment(commentId);
	}

	async getComments(slug: string, userId?: number): Promise<CommentsResponseDto> {
		const article = await this.articlesRepository.getArticle(slug);
		if (!article) {
			throw new HttpError(401, 'article not found');
		}
		const comments = await this.commentsRepository.getComments(slug, userId);

		return { comments };
	}
}
