import swaggerJsdoc from "swagger-jsdoc";
import { APP_NAME, API_PREFIX } from "@/config/constants";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: `${APP_NAME} API`,
      version: "1.0.0",
      description: "SkillSwap peer-to-peer skill exchange platform API",
    },
    servers: [{ url: API_PREFIX }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/modules/**/routes/*.ts", "./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
