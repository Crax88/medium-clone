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
exports.TokensService = void 0;
const inversify_1 = require("inversify");
const jsonwebtoken_1 = require("jsonwebtoken");
const types_1 = require("../types");
let TokensService = class TokensService {
    constructor(configService, tokensRepository) {
        this.configService = configService;
        this.tokensRepository = tokensRepository;
    }
    generateTokens(payload) {
        const accessToken = (0, jsonwebtoken_1.sign)(payload, this.configService.get('ACCESS_TOKEN_SECRET'), {
            expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES'),
        });
        const refreshToken = (0, jsonwebtoken_1.sign)(payload, this.configService.get('REFRESH_TOKEN_SECRET'), {
            expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES'),
        });
        return { accessToken, refreshToken };
    }
    validateAccessToken(token) {
        try {
            const decoded = (0, jsonwebtoken_1.verify)(token, this.configService.get('ACCESS_TOKEN_SECRET'));
            return decoded;
        }
        catch (error) {
            return null;
        }
    }
    validateRefreshToken(token) {
        try {
            const decoded = (0, jsonwebtoken_1.verify)(token, this.configService.get('REFRESH_TOKEN_SECRET'));
            return decoded;
        }
        catch (error) {
            return null;
        }
    }
    saveToken(userId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.tokensRepository.saveToken(userId, token);
        });
    }
    removeToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.tokensRepository.deleteToken(token);
        });
    }
    findToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundToken = yield this.tokensRepository.findToken(token);
            return foundToken;
        });
    }
};
TokensService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.TokenRepository)),
    __metadata("design:paramtypes", [Object, Object])
], TokensService);
exports.TokensService = TokensService;
