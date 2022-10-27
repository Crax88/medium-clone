import { inject, injectable } from 'inversify';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TypeormService } from '../shared/services/typeorm.service';
import { Article } from './article.entity';
import { ArticlesRepositoryInterface } from './types/articlesRepository.interface';
import { ArticleDto } from './types/article.dto';
import { ArticleSaveDto } from './types/articleSave.dto';
import { TYPES } from '../types';

@injectable()
export class ArticlesRepository implements ArticlesRepositoryInterface {
	private repository: Repository<Article>;

	constructor(@inject(TYPES.DatabaseService) databaseService: TypeormService) {
		this.repository = databaseService.getRepository(Article);
	}

	async createArticle(dto: ArticleSaveDto): Promise<Article> {
		const newArticle = this.repository.create(dto);
		await this.repository.save(newArticle);
		return newArticle;
	}

	async updateArticle(slug: string, dto: ArticleSaveDto): Promise<UpdateResult> {
		return await this.repository.update({ slug }, dto);
	}

	async deleteArticle(slug: string): Promise<DeleteResult> {
		return await this.repository.delete({ slug });
	}

	async getArticle(slug: string): Promise<ArticleDto | null> {
		const article = await this.repository
			.createQueryBuilder('article')
			.select([
				'article.slug as slug',
				'article.title as title',
				'article.description as description',
				'article.body as body',
				'article.createdAt as createdAt',
				'article.updatedAt as updatedAt',
				'json_build_object(\'username\',"user"."username",\'bio\',"user"."bio",\'image\',"user"."image") as author',
			])
			.innerJoin('article.author', 'user')
			.where('article.slug = :slug', { slug })
			.getRawOne();

		return article;
	}

	async getArticles(query: string): Promise<ArticleDto[]> {
		const articles = await this.repository
			.createQueryBuilder('article')
			.select([
				'article.slug as slug',
				'article.title as title',
				'article.description as description',
				'article.body as body',
				'article.createdAt as createdAt',
				'article.updatedAt as updatedAt',
				'json_build_object(\'username\',"user"."username",\'bio\',"user"."bio",\'image\',"user"."image") as author',
			])
			.innerJoin('article.authorId', 'user')
			// .where('article.slug = :slug', { slug })
			.getRawMany();

		return articles;
	}

	async getArticleRaw(slug: string): Promise<Article | null> {
		return await this.repository.findOne({ where: { slug } });
	}
}
