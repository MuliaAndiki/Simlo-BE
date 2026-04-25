"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportSchemas = void 0;
exports.reportSchemas = {
    "/api/report/created": {
        post: {
            tags: ["Report"],
            summary: "Buat laporan baru",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/CreateReportRequest" },
                    },
                },
            },
            responses: {
                "201": {
                    description: "Laporan berhasil dibuat",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ApiResponse" },
                        },
                    },
                },
                "400": {
                    description: "Bad request",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
                "500": {
                    description: "Server error",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
            },
        },
    },
    "/api/report/delete/{id}": {
        delete: {
            tags: ["Report"],
            summary: "Hapus laporan berdasarkan id",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "ID laporan yang akan dihapus",
                },
            ],
            responses: {
                "203": {
                    description: "Laporan berhasil dihapus",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ApiResponse" },
                        },
                    },
                },
                "400": {
                    description: "Bad request atau status tidak memenuhi syarat",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
                "401": {
                    description: "Unauthorized",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
                "500": {
                    description: "Server error",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
            },
        },
    },
    "/api/report/update/{id}": {
        put: {
            tags: ["Report"],
            summary: "Update Report Apabila Belum Done",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/UpdateReportRequest" },
                    },
                },
            },
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "ID Laporan Yang Bakal DiUpdate",
                },
            ],
            responses: {
                "203": {
                    description: "Laporan berhasil update",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ApiResponse" },
                        },
                    },
                },
                "400": {
                    description: "Bad request atau status tidak memenuhi syarat",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorRespone" },
                        },
                    },
                },
                "401": {
                    description: "Unauthorized",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
                "500": {
                    description: "Server error",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
            },
        },
    },
    "/api/report/patch/{id}": {
        patch: {
            tags: ["Report"],
            summary: "Update Status Report By Admin",
            security: [{ bearerAuth: [], baseRole: ["admin"] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "ID Laporan Yang Bakal DiUpdate",
                },
            ],
            responses: {
                "203": {
                    description: "Laporan berhasil update status",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ApiResponse" },
                        },
                    },
                },
                "400": {
                    description: "Bad request atau status tidak memenuhi syarat",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorRespone" },
                        },
                    },
                },
                "401": {
                    description: "Unauthorized",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
                "500": {
                    description: "Server error",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
            },
        },
    },
};
