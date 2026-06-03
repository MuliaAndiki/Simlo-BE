"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportSchemas = void 0;
exports.reportSchemas = {
    "/api/report/created": {
        post: {
            tags: ["Report"],
            summary: "Buat laporan baru",
            security: [{ bearerAuth: [], ApiKeyAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                city: { type: "string", example: "Jakarta" },
                                address_detail: {
                                    type: "string",
                                    example: "Jl. Sudirman No. 10",
                                },
                                image_url: {
                                    type: "string",
                                    example: "https://example.com/report.jpg",
                                },
                                latitude: { type: "number", example: -6.2 },
                                longitude: { type: "number", example: 106.816666 },
                                reportStatus: {
                                    type: "string",
                                    enum: ["isPending", "inProgress", "done", "rejected"],
                                },
                            },
                            required: [
                                "city",
                                "address_detail",
                                "image_url",
                                "latitude",
                                "longitude",
                                "reportStatus",
                            ],
                        },
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
            security: [{ bearerAuth: [], ApiKeyAuth: [] }],
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
            security: [{ bearerAuth: [], ApiKeyAuth: [] }],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                city: { type: "string", example: "update reports" },
                                addres_detail: { type: "string", example: "location update" },
                                latitude: {
                                    type: "number",
                                    example: 123123,
                                },
                                longitude: {
                                    type: "number",
                                    example: -312312,
                                },
                                reportStatus: {
                                    type: "string",
                                    enum: ["isPending", "inProgress", "done", "rejected"],
                                },
                            },
                        },
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
            security: [{ bearerAuth: [], baseRole: ["admin"], ApiKeyAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "ID Laporan Yang Bakal DiUpdate",
                },
            ],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                reportStatus: {
                                    type: "string",
                                    enum: ['isPending", "inProgress", "done", "rejected'],
                                },
                            },
                        },
                    },
                },
            },
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
    "/api/report/manual-label/{id}": {
        post: {
            tags: ["Report"],
            summary: "Labeling manual jalan berlobang",
            description: "Digunakan apabila gambar laporan tidak terdeteksi oleh model ML. Pengguna dapat menambahkan bounding box secara manual.",
            security: [{ bearerAuth: [], ApiKeyAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "ID laporan yang akan dilabeli secara manual",
                },
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                confidenceScore: {
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1,
                                    example: 1,
                                    description: "Opsional. Default 1 untuk labeling manual",
                                },
                                boundingBoxes: {
                                    type: "array",
                                    minItems: 1,
                                    items: {
                                        type: "object",
                                        properties: {
                                            x: { type: "number", example: 120 },
                                            y: { type: "number", example: 80 },
                                            width: { type: "number", example: 64 },
                                            height: { type: "number", example: 48 },
                                            label: {
                                                type: "string",
                                                example: "berlubang",
                                                description: "Default berlubang jika tidak diisi",
                                            },
                                        },
                                        required: ["x", "y", "width", "height"],
                                    },
                                },
                            },
                            required: ["boundingBoxes"],
                        },
                    },
                },
            },
            responses: {
                "200": {
                    description: "Labeling manual berhasil disimpan",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ApiResponse" },
                        },
                    },
                },
                "400": {
                    description: "Payload tidak valid",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
                "403": {
                    description: "Tidak memiliki akses ke laporan",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
                "404": {
                    description: "Laporan atau hasil ML tidak ditemukan",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
                "409": {
                    description: "Laporan sudah terdeteksi oleh model (non-admin)",
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
    "/api/report/get": {
        get: {
            tags: ["Report"],
            summary: "Get All Report",
            security: [{ bearerAuth: [], ApiKeyAuth: [] }],
            responses: {
                "200": {
                    description: "Berhasil mengambil seluruh report ",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ApiResponse" },
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
    "/api/report/get/:id": {
        get: {
            tags: ["Report"],
            summary: "Get All Report By ID",
            security: [{ bearerAuth: [], ApiKeyAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "ID Laporan Yang Bakal DiGet",
                },
            ],
            responses: {
                "200": {
                    description: "Berhasil mengambil report by id",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ApiResponse" },
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
