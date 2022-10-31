import { inject, injectable } from 'inversify';
import { DeleteResult, Repository } from 'typeorm';
import { TypeormService } from '../shared/services/typeorm.service';
import { Comment } from './comment.entity';
import { CommentsRepositoryInterface } from './types/comments.repository.interface';
import { CreateCommentDto } from './types/createComment.dto';
import { TYPES } from '../types';

@injectable()
export class CommentsRepository implements CommentsRepositoryInterface {
	private repository: Repository<Comment>;

	constructor(@inject(TYPES.DatabaseService) databaseService: TypeormService) {
		this.repository = databaseService.getRepository(Comment);
	}

	async createComment(dto: CreateCommentDto, userId: number, articleId: number): Promise<Comment> {
		const newComment = this.repository.create({
			body: dto.body,
			authorId: userId,
			articleId: articleId,
		});
		await this.repository.save(newComment);
		return newComment;
	}

	async deleteComment(commentId: number): Promise<DeleteResult> {
		return await this.repository.delete(commentId);
	}

	async getComments(articleId: number): Promise<Comment[]> {
		const comments = await this.repository.find({
			where: { articleId },
			relations: ['author', 'author.followers'],
		});

		return comments;
	}

	async getComment(commentId: number): Promise<Comment | null> {
		return await this.repository.findOne({
			where: { id: commentId },
			relations: ['author', 'author.followers'],
		});
	}
}
