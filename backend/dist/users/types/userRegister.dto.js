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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegisterRequestDto = exports.UserRegisterDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UserRegisterDto {
}
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'invalid format' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'is required' }),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.Matches)(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!.*]).{8,64}$/gm, {
        message: 'at least 8 characters long with 1 special character and capital character',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'is required' }),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.MinLength)(3, { message: 'at least 3 characters' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'is required' }),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "username", void 0);
exports.UserRegisterDto = UserRegisterDto;
class UserRegisterRequestDto {
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UserRegisterDto),
    __metadata("design:type", UserRegisterDto)
], UserRegisterRequestDto.prototype, "user", void 0);
exports.UserRegisterRequestDto = UserRegisterRequestDto;
