const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bookstore Management System API',
      version: '1.0.0',
      description: 'MERN bookstore REST API with JWT auth and role-based access',
    },
    servers: [{ url: 'http://localhost:5000', description: 'Local development' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js', './config/swagger.paths.js'],
};

module.exports = swaggerJsdoc(options);
