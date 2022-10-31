import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';
import { TypeormService } from '../shared/services/typeorm.service';
import { HttpError } from '../errors/httpError';
import { Article } from '../articles/article.entity';
import { CommentsServiceInterface } from './types/commentsService.interface';
import { CommentsRepositoryInterface } from './types/comments.repository.interface';
import { CommentResponseDto, CommentsResponseDto } from './types/comment.dto';
import { CreateCommentRequestDto } from './types/createComment.dto';
import { TYPES } from '../types';

@injectable()
export class CommentsService implements CommentsServiceInterface {
	private articlesRepository: Repository<Article>;

	constructor(
		@inject(TYPES.DatabaseService) databaseService: TypeormService,
		@inject(TYPES.CommentsRepository) private commentsRepository: CommentsRepositoryInterface,
	) {
		this.articlesRepository = databaseService.getRepository(Article);
	}
	async createComment(
		slug: string,
		{ comment }: CreateCommentRequestDto,
		userId: number,
	): Promise<CommentResponseDto> {
		const article = await this.articlesRepository.findOneBy({ slug });
		if (!article) {
			throw new HttpError(404, 'article not found');
		}
		const newComment = await this.commentsRepository.createComment(comment, userId, article.id);
		const savedComment = await this.commentsRepository.getComment(newComment.id);
		if (!savedComment) {
			throw new HttpError(404, 'comment not found');
		}
		return {
			comment: {
				id: savedComment.id,
				body: savedComment.body,
				createdAt: savedComment.createdAt,
				updatedAt: savedComment.updatedAt,
				author: {
					username: savedComment.author.username,
					bio: savedComment.author.bio,
					image: savedComment.author.image,
					following: false,
				},
			},
		};
	}

	async deleteComment(slug: string, commentId: number, userId: number): Promise<void> {
		const article = await this.articlesRepository.findOneBy({ slug });
		if (!article) {
			throw new HttpError(401, 'article not found');
		}
		const comment = await this.commentsRepository.getComment(commentId);
		if (!comment) {
			throw new HttpError(404, 'comment not found');
		}
		if (comment.authorId !== userId) {
			throw new HttpError(403, "can't delete others comment");
		}
		const result = await this.commentsRepository.deleteComment(comment.id);
		if (!result.affected || result.affected === 0) {
			throw new HttpError(404, 'comment not found');
		}
	}

	async getComments(slug: string, userId?: number): Promise<CommentsResponseDto> {
		const article = await this.articlesRepository.findOneBy({ slug });
		if (!article) {
			throw new HttpError(401, 'article not found');
		}
		const comments = await this.commentsRepository.getComments(article.id);
		const preparedComments = comments.map((comment) => {
			return {
				id: comment.id,
				body: comment.body,
				createdAt: comment.createdAt,
				updatedAt: comment.updatedAt,
				author: {
					bio: comment.author.bio,
					image: comment.author.image,
					username: comment.author.username,
					following: comment.author.followers.findIndex((follower) => follower.id === userId) > -1,
				},
			};
		});
		return { comments: preparedComments };
	}
}
