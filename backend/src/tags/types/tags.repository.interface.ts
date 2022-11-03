import { TagDto } from './tags.dto';

export interface TagsRepositoryInterface {
	saveTag: (tagName: string) => Promise<TagDto>;
	getTags: () => Promise<TagDto[]>;
	getTag: (tagName: string) => Promise<TagDto | null>;
}
