import { inject, injectable } from 'inversify';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TypeormService } from '../shared/services/typeorm.service';
import { HttpError } from '../errors/httpError';
import { Article } from '../articles/article.entity';
import { Comment } from './comment.entity';
import { CommentsServiceInterface } from './types/commentsService.interface';
import { CommentResponseDto, CommentsResponseDto } from './types/comment.dto';
import { CreateCommentRequestDto } from './types/createComment.dto';
import { TYPES } from '../types';

@injectable()
export class CommentsService implements CommentsServiceInterface {
	private commentsRepository: Repository<Comment>;
	private articlesRepository: Repository<Article>;

	constructor(@inject(TYPES.DatabaseService) databaseService: TypeormService) {
		this.commentsRepository = databaseService.getRepository(Comment);
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
		const newComment = this.commentsRepository.create({
			...comment,
			articleId: article.id,
			authorId: userId,
		});
		await this.commentsRepository.save(newComment);

		return this.getComment(newComment.id, userId);
	}

	async deleteComment(slug: string, commentId: number, userId: number): Promise<void> {
		const article = await this.articlesRepository.findOneBy({ slug });
		if (!article) {
			throw new HttpError(401, 'article not found');
		}
		const comment = await this.commentsRepository.findOneBy({ id: commentId });
		if (!comment) {
			throw new HttpError(401, 'comment not found');
		}
		if (comment.authorId !== userId) {
			throw new HttpError(403, 'can\t delete others comment');
		}
		const result = await this.commentsRepository.delete(comment.id);
		if (!result.affected || result.affected === 0) {
			throw new HttpError(404, 'comment not found');
		}
	}

	async getComments(slug: string, userId?: number): Promise<CommentsResponseDto> {
		const comments = await this.commentsRepository
			.createQueryBuilder('c')
			.select([
				'c.id as id',
				'c.body as body',
				'c.createdAt as "createAt"',
				'c.updatedAt as "updatedAt"',
				"json_build_object('username', u.username, 'bio', u.bio, 'image', u.image, 'following', u.following) as author",
			])
			.innerJoin(
				(qb: SelectQueryBuilder<Comment>) => {
					return qb
						.select([
							'u."id" as "id"',
							'u.username as "username"',
							'u.bio as "bio"',
							'u.image as "image"',
							`COALESCE((SELECT CASE WHEN pf.following_id IS NOT NULL THEN true ELSE false  END FROM profile_followers pf WHERE pf.following_id = u.id AND CASE WHEN ${
								userId ? userId : null
							} IS NOT NULL THEN pf.follower_id = ${
								userId ? userId : null
							} ELSE false END), false) as following`,
						])
						.from('users', 'u');
				},
				'u',
				'u."id" = c.author_id',
			)
			.innerJoin('c.article', 'article')
			.where('article.slug = :slug', { slug })
			.getRawMany();

		return { comments };
	}

	async getComment(id: number, userId?: number): Promise<CommentResponseDto> {
		const comment = await this.commentsRepository
			.createQueryBuilder('c')
			.select([
				'c.id as id',
				'c.body as body',
				'c.createdAt as "createAt"',
				'c.updatedAt as "updatedAt"',
				"json_build_object('username', u.username, 'bio', u.bio, 'image', u.image, 'following', u.following) as author",
			])
			.innerJoin(
				(qb: SelectQueryBuilder<Comment>) => {
					return qb
						.select([
							'u."id" as "id"',
							'u.username as "username"',
							'u.bio as "bio"',
							'u.image as "image"',
							`COALESCE((SELECT CASE WHEN pf.following_id IS NOT NULL THEN true ELSE false  END FROM profile_followers pf WHERE pf.following_id = u.id AND CASE WHEN ${
								userId ? userId : null
							} IS NOT NULL THEN pf.follower_id = ${
								userId ? userId : null
							} ELSE false END), false) as following`,
						])
						.from('users', 'u');
				},
				'u',
				'u."id" = c.author_id',
			)
			.where('c.id = :comment_id', { comment_id: id })
			.getRawOne();

		if (!comment) {
			throw new HttpError(404, 'comment not found');
		}

		return { comment };
	}
}
