import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Driving School Backend API",
      version: "1.0.0",
      description: "API documentation for the Driving School backend system",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // optional but helps clients know it's a JWT
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/config/swagger.yaml", "./src/routes/*.js", "./src/controllers/*.js"], // Add more paths if needed
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app, port) => {
  app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  console.log(`✅ Swagger Docs available at: http://localhost:${port}/docs`);
};
