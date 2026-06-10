import swaggerJSDoc from "swagger-jsdoc";
import { authSchemas } from "./docs/schemas/auth.schema";
import { reportSchemas } from "./docs/schemas/report.schema";
import { sessionSchemas } from "./docs/schemas/session.schema";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Simlo Api",
      version: "1.0.0",
      description:
        "API dokumentasi untuk Simlo-BE. Menggunakan komponen OpenAPI untuk schema dan keamanan JWT.",
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
      ...authSchemas,
      ...reportSchemas,
      ...sessionSchemas,
    },
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Report", description: "Report management endpoints" },
      { name: "Session", description: "Session and current user endpoints" },
    ],
  },
  apis: ["./src/app.ts", "./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
