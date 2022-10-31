import { CommentResponseDto, CommentsResponseDto } from './comment.dto';
import { CreateCommentRequestDto } from './createComment.dto';

export interface CommentsServiceInterface {
	createComment: (
		slug: string,
		dto: CreateCommentRequestDto,
		userId: number,
	) => Promise<CommentResponseDto>;
	deleteComment: (slug: string, commentId: number, userId: number) => Promise<void>;
	getComments: (slug: string, userId?: number) => Promise<CommentsResponseDto>;
}
