import { Tag } from '../../tags/tag.entity';

export interface ArticleSaveDto {
	slug: string;
	title: string;
	description: string;
	body: string;
	authorId: number;
	tags: Tag[];
}
