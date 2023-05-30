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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesService = void 0;
const inversify_1 = require("inversify");
const slugify_1 = __importDefault(require("slugify"));
const httpError_1 = require("../errors/httpError");
const types_1 = require("../types");
let ArticlesService = class ArticlesService {
    constructor(tagsService, articlesRepository, usersRepository) {
        this.tagsService = tagsService;
        this.articlesRepository = articlesRepository;
        this.usersRepository = usersRepository;
    }
    createArticle({ article }, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const slug = this.createSlug(article.title);
            const tags = [];
            if (article.tagList && article.tagList.length) {
                for (const tag of article.tagList) {
                    tags.push(yield this.tagsService.saveTag(tag));
                }
            }
            yield this.articlesRepository.createArticle(Object.assign(Object.assign({}, article), { slug, authorId: userId, tags }));
            return this.getArticle(slug, userId);
        });
    }
    updateArticle(slug, { article }, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundArticle = yield this.articlesRepository.getArticle(slug);
            if (!foundArticle) {
                throw new httpError_1.HttpError(404, 'article not found');
            }
            const user = yield this.usersRepository.findUser({ id: userId });
            if (!user) {
                throw new httpError_1.HttpError(404, 'user profile not found');
            }
            if (foundArticle.author.username !== user.username) {
                throw new httpError_1.HttpError(403, 'not authorized');
            }
            const toUpdate = {
                title: article.title || foundArticle.title,
                description: article.description || foundArticle.description,
                body: article.body || foundArticle.body,
                authorId: userId,
                slug: article.title ? this.createSlug(article.title) : foundArticle.slug,
            };
            yield this.articlesRepository.updateArticle(slug, toUpdate);
            return this.getArticle(toUpdate.slug, userId);
        });
    }
    deleteArticle(slug, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield this.articlesRepository.getArticle(slug);
            if (!article) {
                throw new httpError_1.HttpError(404, 'article not found');
            }
            const user = yield this.usersRepository.findUser({ id: userId });
            if (!user) {
                throw new httpError_1.HttpError(404, 'user profile not found');
            }
            if (article.author.username !== user.username) {
                throw new httpError_1.HttpError(403, 'not authorized');
            }
            yield this.articlesRepository.deleteArticle(slug);
        });
    }
    getArticle(slug, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield this.articlesRepository.getArticle(slug);
            if (!article) {
                throw new httpError_1.HttpError(404, 'article not found');
            }
            return { article };
        });
    }
    getArticles(query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { articles, articlesCount } = yield this.articlesRepository.getArticles(Object.assign(Object.assign({}, query), { userId }));
            return { articles, articlesCount };
        });
    }
    getFeed(query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { articles, articlesCount } = yield this.articlesRepository.getArticles(Object.assign(Object.assign({}, query), { followerId: userId }));
            return { articles, articlesCount };
        });
    }
    favoriteArticle(slug, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield this.articlesRepository.getArticle(slug, userId);
            if (!article) {
                throw new httpError_1.HttpError(404, 'article not found');
            }
            if (article.favorited) {
                return { article };
            }
            yield this.articlesRepository.favoriteArticle(slug, userId);
            article.favorited = true;
            article.favoritesCount += 1;
            return { article };
        });
    }
    unfavoriteArticle(slug, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield this.articlesRepository.getArticle(slug, userId);
            if (!article) {
                throw new httpError_1.HttpError(404, 'article not found');
            }
            if (!article.favorited) {
                return { article };
            }
            yield this.articlesRepository.unfavoriteArticle(slug, userId);
            article.favorited = false;
            article.favoritesCount -= 1;
            return { article };
        });
    }
    createSlug(title) {
        return ((0, slugify_1.default)(title, { lower: true, replacement: '-', trim: true }) +
            '-' +
            Date.now().toString().slice(7));
    }
};
ArticlesService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.TagsService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ArticlesRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.UsersRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ArticlesService);
exports.ArticlesService = ArticlesService;
