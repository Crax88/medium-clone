"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryHelperService = void 0;
const inversify_1 = require("inversify");
let QueryHelperService = class QueryHelperService {
    parameterOrNull(columnName, paramName, operator = '=') {
        return `(${columnName} ${operator} :${paramName} OR COALESCE(:${paramName}, NULL) IS NULL)`;
    }
    valueOrNull(value, type) {
        var _a;
        if (type === 'string' && typeof value === 'string') {
            return (_a = value.toString()) !== null && _a !== void 0 ? _a : null;
        }
        if (type === 'number' && typeof value !== 'object') {
            return value === undefined || value === null ? null : +value;
        }
        return null;
    }
};
QueryHelperService = __decorate([
    (0, inversify_1.injectable)()
], QueryHelperService);
exports.QueryHelperService = QueryHelperService;
