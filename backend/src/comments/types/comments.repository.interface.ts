import { CommentDto } from './comment.dto';
import { CreateCommentDto } from './createComment.dto';

export interface CommentsRepositoryInterface {
	createComment: (dto: CreateCommentDto, userId: number, slug: string) => Promise<void>;
	deleteComment: (commentId: number) => Promise<void>;
	getComments: (slug: string, currentUserId?: number) => Promise<CommentDto[]>;
	getCommentLast: (slug: string, currentUserId: number) => Promise<CommentDto | null>;
	getComment: (id: number, currentUserId?: number) => Promise<CommentDto | null>;
}
