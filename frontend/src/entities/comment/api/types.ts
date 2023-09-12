import { type TComment } from '../model/types';

export type TCommentDeleteDto = {
	slug: string;
	id: TComment['id'];
};

export type TCommentsRequestDto = {
	slug: string;
};

export type TCommentsResponseDto = {
	comments: TComment[];
};

export type TCommentCreateDto = {
	body: string;
	slug: string;
};

export type TCommentCreateResponseDto = {
	comment: TComment;
};
