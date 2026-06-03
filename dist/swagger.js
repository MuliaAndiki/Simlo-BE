"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const auth_schema_1 = require("./docs/schemas/auth.schema");
const report_schema_1 = require("./docs/schemas/report.schema");
const session_schema_1 = require("./docs/schemas/session.schema");
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Boilerpad API",
            version: "1.0.0",
            description: "API dokumentasi untuk Simlo-BE. Menggunakan komponen OpenAPI untuk schema dan keamanan JWT.",
        },
        servers: [
            {
                url: "http://localhost:5000",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
                ApiKeyAuth: {
                    type: "apiKey",
                    in: "header",
                    name: "x-internal-api-key",
                    description: "Masukkan Internal API Key Anda di sini",
                },
            },
            schemas: {
                ErrorResponse: {
                    type: "object",
                    properties: {
                        status: { type: "integer", example: 400 },
                        message: { type: "string", example: "Bad request" },
                        error: { type: ["string", "object"], nullable: true },
                    },
                },
                ApiResponse: {
                    type: "object",
                    properties: {
                        status: { type: "integer" },
                        message: { type: "string" },
                        data: { type: "object" },
                    },
                },
            },
        },
        security: [
            {
                ApiKeyAuth: [],
            },
        ],
        paths: {
            ...auth_schema_1.authSchemas,
            ...report_schema_1.reportSchemas,
            ...session_schema_1.sessionSchemas,
        },
        tags: [
            { name: "Auth", description: "Authentication endpoints" },
            { name: "Report", description: "Report management endpoints" },
            { name: "Session", description: "Session and current user endpoints" },
        ],
    },
    apis: ["./src/app.ts", "./src/routes/*.ts", "./src/controllers/*.ts"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
