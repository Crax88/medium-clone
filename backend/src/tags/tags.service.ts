import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';
import { TypeormService } from '../shared/services/typeorm.service';
import { TYPES } from '../types';
import { Tag } from './tag.entity';
import { TagsDto } from './types/tags.dto';
import { TagsServiceInterface } from './types/tagsService.interface';

@injectable()
export class TagsService implements TagsServiceInterface {
	private repository: Repository<Tag>;
	constructor(@inject(TYPES.DatabaseService) databaseService: TypeormService) {
		this.repository = databaseService.getRepository(Tag);
	}

	async saveTag(tag: string): Promise<Tag> {
		const existedTag = await this.repository.findOneBy({ tagName: tag });
		if (existedTag) {
			return existedTag;
		}
		const newTag = this.repository.create({ tagName: tag });
		await this.repository.save(newTag);
		return newTag;
	}

	async getPopularTags(): Promise<Tag[]> {
		const tags = await this.repository
			.createQueryBuilder()
			.select(['t.id', 't.tag_name as "tagName"'])
			.from('tags', 't')
			.innerJoin('article_tags', 'at', 'at."tag_id" = t.id')
			.groupBy('t.id, t.tag_name')
			.orderBy('count(*)', 'DESC')
			.limit(20)
			.execute();

		return tags;
	}

	buildPopularTagsResponse(tags: Tag[]): TagsDto {
		return tags.map((tag) => tag.tagName);
	}
}
