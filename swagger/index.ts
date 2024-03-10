import swaggerAutogen from "swagger-autogen"
require("dotenv").config();

const host = process.env.HOST;
const port = process.env.PORT;

if (!host || !port) throw Error(`No HOST or PORT could be found, did you set them in your .env ✘'); //TODO find the env and show it in this error log`);

console.log("HOST:", `\x1b[33m ${host} ✔ \x1b[0m`);
console.log("PORT:", `\x1b[33m ${port} ✔ \x1b[0m`);

const doc = {
  info: {
    title: "Nico Social API",
    description: "The API for Nico Social Project",
    version: "v1.0.0",
  },
  host: `${host}:${port}`,
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Bearer token for authenticating the user'
    }
  }
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/index.ts"];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as: index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);
