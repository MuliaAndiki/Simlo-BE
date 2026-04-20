import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Boilerpad API",
      version: "1.0.0",
      description:
        "Express TypeScript API documentation generated with Swagger.",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./src/app.ts", "./src/routes/*.ts", "./src/controllers/*.ts"],
  tags: [{ name: "Auth", description: "Authentication endpoints" },],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
