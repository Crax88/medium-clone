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
exports.TagsRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_service_1 = require("../shared/services/typeorm.service");
const types_1 = require("../types");
const tag_entity_1 = require("./tag.entity");
let TagsRepository = class TagsRepository {
    constructor(databaseService) {
        this.repository = databaseService.getRepository(tag_entity_1.Tag);
    }
    saveTag(tagName) {
        return __awaiter(this, void 0, void 0, function* () {
            const newTag = this.repository.create({ tagName });
            yield this.repository.save(newTag);
            return newTag;
        });
    }
    getTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const tags = yield this.repository
                .createQueryBuilder()
                .select(['t.id', 't.tag_name as "tagName"'])
                .from('tags', 't')
                .innerJoin('article_tags', 'at', 'at."tag_id" = t.id')
                .groupBy('t.id, t.tag_name')
                .orderBy('count(*)', 'DESC')
                .limit(20)
                .execute();
            return tags;
        });
    }
    getTag(tagName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findOne({ where: { tagName } });
        });
    }
};
TagsRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.DatabaseService)),
    __metadata("design:paramtypes", [typeorm_service_1.TypeormService])
], TagsRepository);
exports.TagsRepository = TagsRepository;
