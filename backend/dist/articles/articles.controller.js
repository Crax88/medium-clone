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
exports.ArticlesContoller = void 0;
const inversify_1 = require("inversify");
const base_controller_1 = require("../common/base.controller");
const validation_middleware_1 = require("../common/validation.middleware");
const auth_guard_1 = require("../shared/services/auth.guard");
const types_1 = require("../types");
const createArticle_dto_1 = require("./types/createArticle.dto");
const updateArticle_dto_1 = require("./types/updateArticle.dto");
let ArticlesContoller = class ArticlesContoller extends base_controller_1.BaseController {
    constructor(loggerService, articlesService) {
        super(loggerService);
        this.articlesService = articlesService;
        this.bindRoutes([
            {
                path: '/articles',
                method: 'get',
                handler: this.getArticles,
            },
            {
                path: '/articles/feed',
                method: 'get',
                handler: this.getFeed,
                middlewares: [new auth_guard_1.AuthGuard()],
            },
            {
                path: '/articles/:slug',
                method: 'get',
                handler: this.getArticle,
            },
            {
                path: '/articles',
                method: 'post',
                handler: this.createArticle,
                middlewares: [new auth_guard_1.AuthGuard(), new validation_middleware_1.ValidationMiddleware(createArticle_dto_1.CreateArticleRequestDto)],
            },
            {
                path: '/articles/:slug',
                method: 'put',
                handler: this.updateArticle,
                middlewares: [new auth_guard_1.AuthGuard(), new validation_middleware_1.ValidationMiddleware(updateArticle_dto_1.UpdateArticleRequestDto)],
            },
            {
                path: '/articles/:slug',
                method: 'delete',
                handler: this.deleteArticle,
                middlewares: [new auth_guard_1.AuthGuard()],
            },
            {
                path: '/articles/:slug/favorite',
                method: 'post',
                handler: this.favoriteArticle,
                middlewares: [new auth_guard_1.AuthGuard()],
            },
            {
                path: '/articles/:slug/favorite',
                method: 'delete',
                handler: this.unfavoriteArticle,
                middlewares: [new auth_guard_1.AuthGuard()],
            },
        ]);
    }
    getArticles(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.articlesService.getArticles(req.query, req.userId);
                this.ok(res, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getFeed(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.articlesService.getFeed(req.query, req.userId);
                this.ok(res, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getArticle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.articlesService.getArticle(req.params.slug, req.userId);
                this.ok(res, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    createArticle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.articlesService.createArticle(req.body, req.userId);
                this.ok(res, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateArticle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.articlesService.updateArticle(req.params.slug, req.body, req.userId);
                this.ok(res, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteArticle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.articlesService.deleteArticle(req.params.slug, req.userId);
                this.ok(res, {});
            }
            catch (error) {
                next(error);
            }
        });
    }
    favoriteArticle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.articlesService.favoriteArticle(req.params.slug, req.userId);
                this.ok(res, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    unfavoriteArticle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.articlesService.unfavoriteArticle(req.params.slug, req.userId);
                this.ok(res, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
};
ArticlesContoller = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.LoggerService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ArticlesService)),
    __metadata("design:paramtypes", [Object, Object])
], ArticlesContoller);
exports.ArticlesContoller = ArticlesContoller;
