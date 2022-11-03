export interface TagDto {
	id: number;
	tagName: string;
}

export interface TagsResponseDto {
	tags: TagDto['tagName'][];
}
