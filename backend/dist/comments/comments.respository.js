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
exports.CommentsRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_service_1 = require("../shared/services/typeorm.service");
const types_1 = require("../types");
const comment_entity_1 = require("./comment.entity");
let CommentsRepository = class CommentsRepository {
    constructor(databaseService) {
        this.repository = databaseService.getRepository(comment_entity_1.Comment);
    }
    createComment(dto, userId, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield this.repository.query('SELECT id FROM articles WHERE slug = $1', [slug]);
            const newComment = this.repository.create({
                body: dto.body,
                authorId: userId,
                articleId: article[0].id,
            });
            yield this.repository.save(newComment);
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.delete(commentId);
        });
    }
    getComments(slug, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield this.repository
                .createQueryBuilder('c')
                .select([
                'c.id as id',
                'c.body as body',
                'c.created_at as "createdAt"',
                'c.updated_at as "updatedAt"',
                "jsonb_build_object('username', u.username, 'image', u.image, 'bio', u.image, 'following', COALESCE(pf.follower_id::bool, false) ) as author",
            ])
                .innerJoin('users', 'u', 'u.id = c.author_id')
                .innerJoin('articles', 'a', 'a.id = c.article_id')
                .leftJoin('profile_followers', 'pf', `pf.following_id = c.author_id AND CASE WHEN ${currentUserId ? currentUserId : null} IS NOT NULL THEN ${currentUserId ? currentUserId : null} = pf.follower_id ELSE false END`, { userId: currentUserId })
                .where('a.slug = :slug', { slug })
                .getRawMany();
            return comments;
        });
    }
    getCommentLast(slug, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.repository
                .createQueryBuilder('c')
                .select([
                'c.id',
                'c.body',
                'c.created_at',
                'c.updated_at',
                "jsonb_build_object('username', u.username, 'image', u.image, 'bio', u.image, 'following', false) as author",
            ])
                .innerJoin('users', 'u', 'u.id = c.author_id')
                .innerJoin('articles', 'a', 'a.id = c.article_id')
                .where('a.slug = :slug', { slug })
                .andWhere('c.author_id = :userId', { userId: currentUserId })
                .orderBy('c.created_at', 'DESC')
                .limit(1)
                .getRawOne();
            return comment;
        });
    }
    getComment(commentId, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.repository
                .createQueryBuilder('c')
                .select([
                'c.id',
                'c.body',
                'c.created_at',
                'c.updated_at',
                "jsonb_build_object('username', u.username, 'image', u.image, 'bio', u.image, 'following', COALESCE(pf.follower_id::bool, false) ) as author",
            ])
                .innerJoin('users', 'u', 'u.id = c.author_id')
                .leftJoin('profile_followers', 'pf', `pf.following_id = c.author_id AND CASE WHEN ${currentUserId ? currentUserId : null} IS NOT NULL THEN ${currentUserId ? currentUserId : null} = pf.follower_id ELSE false END`, { userId: currentUserId })
                .where('c.id = :commentId', { commentId })
                .getRawOne();
            return comment;
        });
    }
};
CommentsRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.DatabaseService)),
    __metadata("design:paramtypes", [typeorm_service_1.TypeormService])
], CommentsRepository);
exports.CommentsRepository = CommentsRepository;
