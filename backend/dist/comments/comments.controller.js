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
exports.CommentsController = void 0;
const inversify_1 = require("inversify");
const base_controller_1 = require("../common/base.controller");
const validation_middleware_1 = require("../common/validation.middleware");
const auth_guard_1 = require("../shared/services/auth.guard");
const types_1 = require("../types");
const createComment_dto_1 = require("./types/createComment.dto");
let CommentsController = class CommentsController extends base_controller_1.BaseController {
    constructor(loggerService, commentsService) {
        super(loggerService);
        this.commentsService = commentsService;
        this.bindRoutes([
            {
                path: '/articles/:slug/comments',
                method: 'post',
                handler: this.createComment,
                middlewares: [new auth_guard_1.AuthGuard(), new validation_middleware_1.ValidationMiddleware(createComment_dto_1.CreateCommentRequestDto)],
            },
            {
                path: '/articles/:slug/comments/:id',
                method: 'delete',
                handler: this.deleteComment,
                middlewares: [new auth_guard_1.AuthGuard()],
            },
            {
                path: '/articles/:slug/comments',
                method: 'get',
                handler: this.getComments,
            },
        ]);
    }
    createComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.commentsService.createComment(req.params.slug, req.body, req.userId);
                this.created(res, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.commentsService.deleteComment(req.params.slug, Number(req.params.id), req.userId);
                this.ok(res, {});
            }
            catch (error) {
                next(error);
            }
        });
    }
    getComments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.commentsService.getComments(req.params.slug, req.userId);
                this.ok(res, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
};
CommentsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.LoggerService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.CommentsService)),
    __metadata("design:paramtypes", [Object, Object])
], CommentsController);
exports.CommentsController = CommentsController;
