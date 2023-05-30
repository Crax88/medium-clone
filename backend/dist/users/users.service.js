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
exports.UsersService = void 0;
const bcryptjs_1 = require("bcryptjs");
const inversify_1 = require("inversify");
const httpError_1 = require("../errors/httpError");
const validationError_1 = require("../errors/validationError");
const types_1 = require("../types");
let UsersService = class UsersService {
    constructor(configService, tokensService, usersRepository) {
        this.configService = configService;
        this.tokensService = tokensService;
        this.usersRepository = usersRepository;
    }
    register({ user: dto }) {
        return __awaiter(this, void 0, void 0, function* () {
            let candidate = yield this.usersRepository.findUser({
                email: dto.email,
            });
            if (candidate) {
                throw new validationError_1.ValidationError({ email: ['already exists'] });
            }
            candidate = yield this.usersRepository.findUser({
                username: dto.username,
            });
            if (candidate) {
                throw new validationError_1.ValidationError({ username: ['already exists'] });
            }
            const salt = yield (0, bcryptjs_1.genSalt)(Number(this.configService.get('SALT')));
            const hashedPasword = yield (0, bcryptjs_1.hash)(dto.password, salt);
            dto.password = hashedPasword;
            yield this.usersRepository.createUser(dto);
            const user = yield this.usersRepository.findUser({ username: dto.username });
            if (!user) {
                throw new httpError_1.HttpError(500, 'Error receiving user info');
            }
            const tokens = this.tokensService.generateTokens({ userId: user.id });
            yield this.tokensService.saveToken(user.id, tokens.refreshToken);
            return this.buildAuthResponse(user, tokens);
        });
    }
    login({ user: dto }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findUser({ email: dto.email });
            if (!user) {
                throw new httpError_1.HttpError(400, 'invalid email or password');
            }
            const isPasswordMatch = yield (0, bcryptjs_1.compare)(dto.password, user.password);
            if (!isPasswordMatch) {
                throw new httpError_1.HttpError(400, 'invalid email or password');
            }
            const tokens = this.tokensService.generateTokens({ userId: user.id });
            yield this.tokensService.saveToken(user.id, tokens.refreshToken);
            return this.buildAuthResponse(user, tokens);
        });
    }
    refresh(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token) {
                throw new httpError_1.HttpError(401, 'unauthorized');
            }
            const tokenData = this.tokensService.validateRefreshToken(token);
            const savedToken = yield this.tokensService.findToken(token);
            yield this.tokensService.removeToken(token);
            if (!tokenData || !savedToken) {
                throw new httpError_1.HttpError(401, 'unauthorized');
            }
            const user = yield this.usersRepository.findUser({ id: tokenData.userId });
            if (!user) {
                throw new httpError_1.HttpError(401, 'unauthorized');
            }
            const tokens = this.tokensService.generateTokens({ userId: user.id });
            yield this.tokensService.saveToken(user.id, tokens.refreshToken);
            return this.buildAuthResponse(user, tokens);
        });
    }
    authenticate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new httpError_1.HttpError(401, 'unauthorized');
            }
            const user = yield this.usersRepository.findUser({ id });
            if (!user) {
                throw new httpError_1.HttpError(401, 'unauthorized');
            }
            const tokens = this.tokensService.generateTokens({ userId: user.id });
            return this.buildAuthResponse(user, tokens);
        });
    }
    logout(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.tokensService.removeToken(token);
        });
    }
    update(currentUserId, { user: dto }) {
        return __awaiter(this, void 0, void 0, function* () {
            const savedUser = yield this.usersRepository.findUser({ id: currentUserId });
            if (!savedUser) {
                throw new httpError_1.HttpError(404, 'user not found');
            }
            if (dto.username) {
                const existedUsername = yield this.usersRepository.findUser({ username: dto.username });
                if (existedUsername && existedUsername.id !== currentUserId) {
                    throw new validationError_1.ValidationError({ username: ['username already taken'] });
                }
            }
            if (dto.email) {
                const existedEmail = yield this.usersRepository.findUser({ email: dto.email });
                if (existedEmail && existedEmail.id !== currentUserId) {
                    throw new validationError_1.ValidationError({ email: ['email already taken'] });
                }
            }
            const toUpdateFields = {};
            for (const key in dto) {
                if (dto[key] !== undefined &&
                    dto[key] !== null &&
                    dto[key] !== '') {
                    toUpdateFields[key] = dto[key];
                }
            }
            if (toUpdateFields.password) {
                const salt = yield (0, bcryptjs_1.genSalt)(Number(this.configService.get('SALT')));
                const hashedPasword = yield (0, bcryptjs_1.hash)(toUpdateFields.password, salt);
                toUpdateFields.password = hashedPasword;
            }
            yield this.usersRepository.updateUser(currentUserId, toUpdateFields);
            const tokens = this.tokensService.generateTokens({ userId: currentUserId });
            return this.buildAuthResponse(Object.assign(Object.assign({}, savedUser), toUpdateFields), tokens);
        });
    }
    buildAuthResponse(user, tokens) {
        return {
            user: {
                email: user.email,
                username: user.username,
                image: user.image,
                bio: user.bio,
                token: tokens.accessToken,
            },
            refreshToken: tokens.refreshToken,
        };
    }
};
UsersService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.TokenService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.UsersRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], UsersService);
exports.UsersService = UsersService;
