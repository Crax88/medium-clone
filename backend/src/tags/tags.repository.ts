import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';
import { TypeormService } from '../shared/services/typeorm.service';
import { Tag } from './tag.entity';
import { TagsRepositoryInterface } from './types/tags.repository.interface';
import { TYPES } from '../types';
import { TagDto } from './types/tags.dto';

@injectable()
export class TagsRepository implements TagsRepositoryInterface {
	private repository: Repository<Tag>;

	constructor(@inject(TYPES.DatabaseService) databaseService: TypeormService) {
		this.repository = databaseService.getRepository(Tag);
	}

	async saveTag(tagName: string): Promise<TagDto> {
		const newTag = this.repository.create({ tagName });
		await this.repository.save(newTag);
		return newTag;
	}

	async getTags(): Promise<TagDto[]> {
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

	async getTag(tagName: string): Promise<TagDto | null> {
		return await this.repository.findOne({ where: { tagName } });
	}
}
