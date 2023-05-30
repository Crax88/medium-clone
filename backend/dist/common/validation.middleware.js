"use strict";
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
exports.ValidationMiddleware = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ValidationMiddleware {
    constructor(classToValidate) {
        this.classToValidate = classToValidate;
    }
    execute({ body }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = (0, class_transformer_1.plainToClass)(this.classToValidate, body);
            const errors = yield (0, class_validator_1.validate)(instance);
            if (errors.length > 0) {
                res.status(422).json({ errors: this.transformErrors(errors) });
            }
            else {
                next();
            }
        });
    }
    transformErrors(errors) {
        return errors.reduce((acc, cur) => {
            if (cur.children && cur.children.length) {
                cur.children.forEach((nested) => {
                    acc[nested.property] = [];
                    for (const key in nested === null || nested === void 0 ? void 0 : nested.constraints) {
                        acc[nested.property].push(nested.constraints[key]);
                    }
                });
            }
            else {
                acc[cur.property] = [];
                for (const key in cur === null || cur === void 0 ? void 0 : cur.constraints) {
                    acc[cur.property].push(cur.constraints[key]);
                }
            }
            return acc;
        }, {});
    }
}
exports.ValidationMiddleware = ValidationMiddleware;
