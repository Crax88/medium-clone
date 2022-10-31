import { DeleteResult } from 'typeorm';
import { Comment } from '../comment.entity';
import { CreateCommentDto } from './createComment.dto';

export interface CommentsRepositoryInterface {
	createComment: (dto: CreateCommentDto, userId: number, articleId: number) => Promise<Comment>;
	deleteComment: (commentId: number) => Promise<DeleteResult>;
	getComments: (articleId: number) => Promise<Comment[]>;
	getComment: (commentId: number) => Promise<Comment | null>;
}
