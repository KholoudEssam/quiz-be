const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Quiz API',
            version: '1.0.0',
        },
    },
    apis: ['./docs/swagger.js'],
};

exports.swaggerDocs = swaggerJsDoc(swaggerOptions);
