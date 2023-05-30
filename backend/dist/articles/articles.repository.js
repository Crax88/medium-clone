"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_service_1 = require("../shared/services/typeorm.service");
const types_1 = require("../types");
const article_entity_1 = require("./article.entity");
let ArticlesRepository = class ArticlesRepository {
    constructor(databaseService, queryHelper) {
        this.queryHelper = queryHelper;
        this.repository = databaseService.getRepository(article_entity_1.Article);
    }
    createArticle(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const newArticle = this.repository.create(dto);
            yield this.repository.save(newArticle);
        });
    }
    updateArticle(slug, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.update({ slug }, dto);
        });
    }
    deleteArticle(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.delete({ slug });
        });
    }
    getArticles(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const articlesQuery = this.repository
                .createQueryBuilder('a')
                .select([
                'a.slug as slug',
                'a.title as title',
                'a.description as description',
                'a.body as body',
                'a.created_at as createdAt',
                'a.updated_at as updatedAt',
                'json_build_object(\'username\',"u"."username",\'bio\',"u"."bio",\'image\',"u"."image", \'following\', COALESCE(pf.follower_id::bool, false)) as author',
                'COALESCE(t."tagList", \'{}\') as "tagList"',
                'COALESCE("af"."favoritesCount"::integer, 0) as "favoritesCount"',
                `CASE WHEN ${query.userId ? query.userId : null} IS NOT NULL AND ${query.userId ? query.userId : null}=ANY(af."userIds") THEN true ELSE false END as favorited`,
            ])
                .innerJoin('users', 'u', 'u.id = a.author_id')
                .leftJoin((qb) => {
                return qb
                    .select(['at."article_id" as "articleId"', 'array_agg(t.tag_name) as "tagList"'])
                    .from('tags', 't')
                    .innerJoin('article_tags', 'at', 'at."tag_id" = t.id')
                    .groupBy('"article_id"');
            }, 't', 't."articleId" = a.id')
                .leftJoin((qb) => {
                return qb
                    .select([
                    'af."article_id" as "articleId"',
                    'COUNT(*) as "favoritesCount"',
                    'array_agg(u.username) as "usernames"',
                    'array_agg(u.id) as "userIds"',
                ])
                    .from('article_favorites', 'af')
                    .innerJoin('users', 'u', 'af.user_id = u.id')
                    .groupBy('"af"."article_id"');
            }, 'af', 'af."articleId" = a.id')
                .leftJoin('profile_followers', 'pf', `pf.following_id = a.author_id AND CASE WHEN ${query.followerId ? query.followerId : null} IS NOT NULL THEN ${query.followerId ? query.followerId : null} = pf.follower_id ELSE false END`)
                .where(`${this.queryHelper.parameterOrNull('u.username', 'username')}`, {
                username: this.queryHelper.valueOrNull(query.author, 'string'),
            })
                .andWhere(this.queryHelper.parameterOrNull('t."tagList"::text', 'tag', 'ILIKE'), {
                tag: this.queryHelper.valueOrNull(query.tag, 'string') ? `%${query.tag}%` : null,
            })
                .andWhere(this.queryHelper.parameterOrNull('af."usernames"::text', 'favorited', 'ILIKE'), {
                favorited: this.queryHelper.valueOrNull(query.favorited, 'string')
                    ? `%${query.favorited}%`
                    : null,
            })
                .andWhere(this.queryHelper.parameterOrNull('pf.follower_id', 'follower'), {
                follower: this.queryHelper.valueOrNull(query.followerId, 'number'),
            })
                .orderBy('a.created_at', 'DESC');
            const articlesCount = yield articlesQuery.getCount();
            const articles = yield articlesQuery
                .limit(query.limit ? Number(query.limit) : 10)
                .offset(query.offset ? Number(query.offset) : 0)
                .getRawMany();
            return { articles, articlesCount };
        });
    }
    getArticle(slug, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield this.repository
                .createQueryBuilder('a')
                .select([
                'a.slug as slug',
                'a.title as title',
                'a.description as description',
                'a.body as body',
                'a.created_at as createdAt',
                'a.updated_at as updatedAt',
                'json_build_object(\'username\',"u"."username",\'bio\',"u"."bio",\'image\',"u"."image", \'following\', COALESCE(pf.follower_id::bool, false)) as author',
                'COALESCE(t."tagList", \'{}\') as "tagList"',
                'COALESCE("af"."favoritesCount"::integer, 0) as "favoritesCount"',
                `CASE WHEN ${currentUserId ? currentUserId : null} IS NOT NULL AND ${currentUserId ? currentUserId : null}=ANY(af."userIds") THEN true ELSE false END as favorited`,
            ])
                .innerJoin('users', 'u', 'u.id = a.author_id')
                .leftJoin((qb) => {
                return qb
                    .select(['at."article_id" as "articleId"', 'array_agg(t.tag_name) as "tagList"'])
                    .from('tags', 't')
                    .innerJoin('article_tags', 'at', 'at."tag_id" = t.id')
                    .groupBy('"article_id"');
            }, 't', 't."articleId" = a.id')
                .leftJoin((qb) => {
                return qb
                    .select([
                    'af."article_id" as "articleId"',
                    'COUNT(*) as "favoritesCount"',
                    'array_agg(u.username) as "usernames"',
                    'array_agg(u.id) as "userIds"',
                ])
                    .from('article_favorites', 'af')
                    .innerJoin('users', 'u', 'af.user_id = u.id')
                    .groupBy('"af"."article_id"');
            }, 'af', 'af."articleId" = a.id')
                .leftJoin('profile_followers', 'pf', `pf.following_id = a.author_id AND CASE WHEN ${currentUserId ? currentUserId : null} IS NOT NULL THEN ${currentUserId ? currentUserId : null} = pf.follower_id ELSE false END`, { userId: currentUserId })
                .where('a.slug = :slug', { slug })
                .getRawOne();
            return article;
        });
    }
    favoriteArticle(slug, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.query('INSERT INTO article_favorites (article_id, user_id) VALUES ((SELECT id FROM articles WHERE slug = $1), $2)', [slug, currentUserId]);
        });
    }
    unfavoriteArticle(slug, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.query('DELETE FROM article_favorites WHERE article_id = (SELECT id FROM articles WHERE slug = $1) AND user_id = $2', [slug, currentUserId]);
        });
    }
};
ArticlesRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.DatabaseService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.QueryHelper)),
    __metadata("design:paramtypes", [typeorm_service_1.TypeormService, Object])
], ArticlesRepository);
exports.ArticlesRepository = ArticlesRepository;
