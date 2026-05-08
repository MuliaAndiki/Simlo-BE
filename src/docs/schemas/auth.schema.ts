export const authSchemas = {
  "/api/auth/google": {
    post: {
      tags: ["Auth"],
      summary: "Login menggunakan Google ID token",
      security: [{ ApiKeyAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                token: { type: "string", example: "ya29.A0ARrdaM..." },
              },
              required: ["token"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Login berhasil",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiResponse" },
            },
          },
        },
        "400": {
          description: "Permintaan tidak valid",
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
  "/api/auth/picture": {
    patch: {
      tags: ["Auth"],
      summary: "Update profil picture user",
      security: [{ bearerAuth: [], ApiKeyAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                picture: {
                  type: "string",
                  example: "https://example.com/avatar.jpg",
                },
              },
              required: ["picture"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Update berhasil",
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
  "/api/auth/developer": {
    post: {
      tags: ["Auth"],
      summary: "login for get token",
      security: [{ ApiKeyAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  example: "test@users.gmail.com",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Update berhasil",
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
  "/api/auth/logout": {
    post: {
      tags: ["Auth"],
      summary: "logout for application",
      security: [{ bearerAuth: [], ApiKeyAuth: [] }],
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
  "/api/auth/me": {
    get: {
      tags: ["Auth"],
      summary: "mendapat data saya",
      security: [{ bearerAuth: [], ApiKeyAuth: [] }],
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
};
