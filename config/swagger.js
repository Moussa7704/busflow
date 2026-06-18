const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Gestion des transport Bus",
            version: "1.0.0",
            description: `BusFlow est une plateforme SaaS de gestion de transport interurbain permettant aux compagnies de transport de gérer`,
        },
        servers: [
            {
                url: "http://localhost:8080/api/v1",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ["./routes/*.js"], // 👈 où sont tes routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;