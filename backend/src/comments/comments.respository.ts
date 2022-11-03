import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';
import { TypeormService } from '../shared/services/typeorm.service';
import { Comment } from './comment.entity';
import { CommentsRepositoryInterface } from './types/comments.repository.interface';
import { CreateCommentDto } from './types/createComment.dto';
import { CommentDto } from './types/comment.dto';
import { TYPES } from '../types';

@injectable()
export class CommentsRepository implements CommentsRepositoryInterface {
	private repository: Repository<Comment>;

	constructor(@inject(TYPES.DatabaseService) databaseService: TypeormService) {
		this.repository = databaseService.getRepository(Comment);
	}

	async createComment(dto: CreateCommentDto, userId: number, articleId: number): Promise<void> {
		const newComment = this.repository.create({
			body: dto.body,
			authorId: userId,
			articleId: articleId,
		});
		await this.repository.save(newComment);
	}

	async deleteComment(commentId: number): Promise<void> {
		await this.repository.delete(commentId);
	}

	async getComments(articleId: number, currentUserId?: number): Promise<CommentDto[]> {
		const comments = await this.repository
			.createQueryBuilder('c')
			.select([
				'c.id',
				'c.body',
				'c.created_at',
				'c.updated_at',
				"jsonb_build_object('username', u.username, 'image', u.image, 'bio', u.image, 'following', COALESCE(pf.follower_id::bool, false) ) as author",
			])
			.innerJoin('users', 'u', 'u.id = c.author_id')
			.leftJoin(
				'profile_followers',
				'pf',
				`pf.following_id = c.author_id AND CASE WHEN ${
					currentUserId ? currentUserId : null
				} IS NOT NULL THEN ${currentUserId ? currentUserId : null} = pf.follower_id ELSE false END`,
				{ userId: currentUserId },
			)
			.where('c.article_id = :articleId', { articleId })
			.getRawMany();

		return comments;
	}

	async getCommentLast(slug: string, currentUserId: number): Promise<CommentDto | null> {
		const comment = await this.repository
			.createQueryBuilder('c')
			.select([
				'c.id',
				'c.body',
				'c.created_at',
				'c.updated_at',
				"jsonb_build_object('username', u.username, 'image', u.image, 'bio', u.image, 'following', false) as author",
			])
			.innerJoin('users', 'u', 'u.id = c.author_id')
			.innerJoin('artciles', 'a', 'a.id = c.article_id')
			.where('a.slug = :slug', { slug })
			.andWhere('c.author_id = :userId', { userId: currentUserId })
			.orderBy('c.created_at', 'DESC')
			.limit(1)
			.getRawOne();

		return comment;
	}

	async getComment(commentId: number, currentUserId?: number): Promise<CommentDto | null> {
		const comment = await this.repository
			.createQueryBuilder('c')
			.select([
				'c.id',
				'c.body',
				'c.created_at',
				'c.updated_at',
				"jsonb_build_object('username', u.username, 'image', u.image, 'bio', u.image, 'following', COALESCE(pf.follower_id::bool, false) ) as author",
			])
			.innerJoin('users', 'u', 'u.id = c.author_id')
			.leftJoin(
				'profile_followers',
				'pf',
				'pf.following_id = c.author_id AND CASE WHEN :userId IS NOT NULL THEN :userId = pf.follower_id ELSE false END',
				{ userId: currentUserId },
			)
			.where('c.id = :commentId', { commentId })
			.getRawOne();

		return comment;
	}
}
