// Stage 5 adds Swagger UI. The full OpenAPI specification is in ../openapi.json.
// Run the integrated project with `npm install && npm start`, then open /docs.
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openapi = require("../openapi.json");
const app = express();
app.use(express.json());
// Add the API routes from Stage 4 here, or use the completed ../app.js.
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));
app.listen(3000, () => console.log("Swagger UI example at http://localhost:3000/docs"));
