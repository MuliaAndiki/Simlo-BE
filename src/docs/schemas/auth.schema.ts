export const authSchemas = {
  "/api/auth/google": {
    post: {
      tags: ["Auth"],
      summary: "Login menggunakan Google ID token",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LoginGoogleRequest" },
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
    "/api/auth/picture": {
      patch: {
        tags: ["Auth"],
        summary: "Update profil picture user",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PatchPictureRequest" },
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
  },
};
