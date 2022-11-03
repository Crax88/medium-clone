import { TagDto, TagsResponseDto } from './tags.dto';

export interface TagsServiceInterface {
	saveTag: (tag: string) => Promise<TagDto>;
	getPopularTags: () => Promise<TagDto[]>;
	buildPopularTagsResponse: (tags: TagDto[]) => TagsResponseDto;
}
