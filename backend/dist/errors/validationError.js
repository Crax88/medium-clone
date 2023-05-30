"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const httpError_1 = require("./httpError");
class ValidationError extends httpError_1.HttpError {
    constructor(errors, context) {
        super(400, 'Validation error', context);
        this.errors = errors;
    }
}
exports.ValidationError = ValidationError;
