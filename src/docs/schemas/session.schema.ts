export const sessionSchemas = {
  "/api/session/current": {
    get: {
      tags: ["Session"],
      summary: "Ambil data user saat ini dari session",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Berhasil mengambil user saat ini",
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
