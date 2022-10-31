import { Tag } from '../tag.entity';

export interface TagsRepositoryInterface {
	saveTag: (tagName: string) => Promise<Tag>;
	getTags: () => Promise<Tag[]>;
	getTag: (tagName: string) => Promise<Tag | null>;
}
