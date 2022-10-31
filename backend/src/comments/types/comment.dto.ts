export interface CommentDto {
	id: number;
	body: string;
	createAt: string;
	updatedAt: string;
	author: {
		username: string;
		bio: string;
		image: string;
		following: boolean;
	};
}

export interface CommentResponseDto {
	comment: CommentDto;
}

export interface CommentsResponseDto {
	comments: CommentDto[];
}
