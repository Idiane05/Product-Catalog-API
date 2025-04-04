const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Product Catalog API',
            version: '1.0.0',
            description: 'A RESTful API for managing product catalog with categories and variants',
            contact: {
                name: 'Diane INGABIRE',
                url: 'https://github.com/Idiane05/Product-Catalog-API.git'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Development server'
            }
        ],
    },
    apis: ['./src/routes/*.js'], // Path to the API routes
};

module.exports = swaggerJsdoc(options);
