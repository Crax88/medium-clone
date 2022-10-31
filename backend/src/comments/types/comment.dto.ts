export interface CommentDto {
	id: number;
	body: string;
	createdAt: string;
	updatedAt: string;
	author: {
		username: string;
		bio: string | null;
		image: string | null;
		following: boolean;
	};
}

export interface CommentResponseDto {
	comment: CommentDto;
}

export interface CommentsResponseDto {
	comments: CommentDto[];
}
