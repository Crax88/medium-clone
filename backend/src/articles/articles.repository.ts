import { inject, injectable } from 'inversify';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { TypeormService } from '../shared/services/typeorm.service';
import { Article } from './article.entity';
import { ArticlesRepositoryInterface } from './types/articles.repository.interface';
import { ArticleSaveDto } from './types/articleSave.dto';
import { ArticlesQueryDto } from './types/articlesQuery.dto';
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

	async updateArticle(articleId: number, dto: Omit<ArticleSaveDto, 'tags'>): Promise<UpdateResult> {
		const result = await this.repository.update(articleId, dto);
		return result;
	}

	async deleteArticle(id: number): Promise<DeleteResult> {
		return await this.repository.delete({ id });
	}

	async getArticles(
		query: ArticlesQueryDto,
	): Promise<{ articles: Article[]; articlesCount: number }> {
		const [articles, articlesCount] = await this.repository.findAndCount({
			relations: {
				author: { followers: true },
				tags: true,
				favorite: true,
			},
			where: {
				author: {
					username: query.author ? query.author : undefined,
				},
				tags: {
					tagName: query.tag ? In([query.tag]) : undefined,
				},
				favorite: {
					username: query.favorited,
				},
			},
			skip: query.offset ? Number(query.offset) : 0,
			take: query.limit ? Number(query.limit) : 10,
			order: {
				createdAt: 'DESC',
			},
		});
		return { articles, articlesCount };
	}

	async getArticle(slug: string): Promise<Article | null> {
		const article = await this.repository.findOne({
			where: { slug },
			relations: {
				author: true,
				favorite: true,
				tags: true,
			},
		});

		return article;
	}

	async saveArticle(article: Article): Promise<Article> {
		return await this.repository.save(article);
	}
}
