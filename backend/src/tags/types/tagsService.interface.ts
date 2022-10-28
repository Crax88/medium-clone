import { Tag } from '../tag.entity';
import { TagsDto } from './tags.dto';

export interface TagsServiceInterface {
	saveTag: (tag: string) => Promise<Tag>;
	getPopularTags: () => Promise<Tag[]>;
	buildPopularTagsResponse: (tags: Tag[]) => TagsDto;
}
