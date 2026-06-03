"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withApiKey = withApiKey;
exports.api = api;
exports.authHeader = authHeader;
const supertest_1 = __importDefault(require("supertest"));
const constants_1 = require("./constants");
function withApiKey(req) {
    return req.set("x-internal-api-key", constants_1.API_KEY);
}
function api(app) {
    return {
        get: (url) => withApiKey((0, supertest_1.default)(app).get(url)),
        post: (url) => withApiKey((0, supertest_1.default)(app).post(url)),
        put: (url) => withApiKey((0, supertest_1.default)(app).put(url)),
        patch: (url) => withApiKey((0, supertest_1.default)(app).patch(url)),
        delete: (url) => withApiKey((0, supertest_1.default)(app).delete(url)),
        raw: (0, supertest_1.default)(app),
    };
}
function authHeader(token) {
    return { Authorization: `Bearer ${token}` };
}
