import { inject, injectable } from 'inversify';

import { TYPES } from '../types';

import { TagDto, TagsResponseDto } from './types/tags.dto';
import { TagsRepositoryInterface } from './types/tags.repository.interface';
import { TagsServiceInterface } from './types/tags.service.interface';

@injectable()
export class TagsService implements TagsServiceInterface {
	constructor(@inject(TYPES.TagsRepository) private tagsRepository: TagsRepositoryInterface) {}

	async saveTag(tag: string): Promise<TagDto> {
		const existedTag = await this.tagsRepository.getTag(tag);
		if (existedTag) {
			return existedTag;
		}
		const newTag = this.tagsRepository.saveTag(tag);
		return newTag;
	}

	async getPopularTags(): Promise<TagDto[]> {
		const tags = await this.tagsRepository.getTags();

		return tags;
	}

	buildPopularTagsResponse(tags: TagDto[]): TagsResponseDto {
		return { tags: tags.map((tag) => tag.tagName) };
	}
}
