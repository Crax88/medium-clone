import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { Tag } from './tag.entity';
import { TagsDto } from './types/tags.dto';
import { TagsRepositoryInterface } from './types/tags.repository.interface';
import { TagsServiceInterface } from './types/tagsService.interface';

@injectable()
export class TagsService implements TagsServiceInterface {
	constructor(@inject(TYPES.TagsRepository) private tagsRepository: TagsRepositoryInterface) {}

	async saveTag(tag: string): Promise<Tag> {
		const existedTag = await this.tagsRepository.getTag(tag);
		if (existedTag) {
			return existedTag;
		}
		const newTag = this.tagsRepository.saveTag(tag);
		return newTag;
	}

	async getPopularTags(): Promise<Tag[]> {
		const tags = await this.tagsRepository.getTags();

		return tags;
	}

	buildPopularTagsResponse(tags: Tag[]): TagsDto {
		return { tags: tags.map((tag) => tag.tagName) };
	}
}
