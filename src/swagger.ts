import swaggerJSDoc from "swagger-jsdoc";
import { authSchemas } from "./docs/schemas/auth.schema";
import { reportSchemas } from "./docs/schemas/report.schema";
import { sessionSchemas } from "./docs/schemas/session.schema";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Boilerpad API",
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
        LoginGoogleRequest: {
          type: "object",
          properties: {
            token: { type: "string", example: "ya29.A0ARrdaM..." },
          },
          required: ["token"],
        },
        PatchPictureRequest: {
          type: "object",
          properties: {
            picture: {
              type: "string",
              example: "https://example.com/avatar.jpg",
            },
          },
          required: ["picture"],
        },
        AuthData: {
          type: "object",
          properties: {
            tokens: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            user: {
              type: "object",
              properties: {
                id: { type: "string", example: "user-123" },
                email: { type: "string", example: "user@example.com" },
                fullName: { type: "string", example: "John Doe" },
                picture: {
                  type: "string",
                  example: "https://example.com/avatar.jpg",
                },
                role: { type: "string", example: "user" },
                sessionId: { type: "string", example: "session-456" },
              },
            },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            status: { type: "integer", example: 200 },
            message: {
              type: "string",
              example: "successfully login with google",
            },
            data: { type: "object" },
          },
        },
        ReportStatusEnum: {
          type: "string",
          enum: ["isPending", "inProgress", "done", "rejected"],
        },
        CreateReportRequest: {
          type: "object",
          properties: {
            city: { type: "string", example: "Jakarta" },
            address_detail: { type: "string", example: "Jl. Sudirman No. 10" },
            image_url: {
              type: "string",
              example: "https://example.com/report.jpg",
            },
            latitude: { type: "number", example: -6.2 },
            longitude: { type: "number", example: 106.816666 },
            reportStatus: { $ref: "#/components/schemas/ReportStatusEnum" },
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
        ReportResponse: {
          type: "object",
          properties: {
            id: { type: "string", example: "report-789" },
            userID: { type: "string", example: "user-123" },
            city: { type: "string", example: "Jakarta" },
            address_detail: { type: "string", example: "Jl. Sudirman No. 10" },
            image_url: {
              type: "string",
              example: "https://example.com/report.jpg",
            },
            latitude: { type: "number", example: -6.2 },
            longitude: { type: "number", example: 106.816666 },
            reportStatus: { $ref: "#/components/schemas/ReportStatusEnum" },
          },
        },
      },
    },
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
