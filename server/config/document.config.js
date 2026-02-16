const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Document",
        version: "1.0.0",
        description: "This MERN stack project is a template for future team projects, built with MongoDB, Express.js, React, and Node.js.",
    },
};

const options =   {
    swaggerDefinition,
    apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec