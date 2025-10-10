const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Tracker API',
      version: '1.0.0',
      description: 'API para sistema de gerenciamento financeiro pessoal',
      contact: {
        name: 'Fernando Ludvig',
        email: 'fernandoludvig@example.com'
      }
    },
    servers: [
      {
        url: 'https://cse341-project1-fphm.onrender.com/finance-tracker',
        description: 'Servidor de produção'
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT no formato: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'firstName', 'lastName'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único do usuário',
              example: '68e03db228d3da6c9a9e5e2b'
            },
            googleId: {
              type: 'string',
              description: 'ID do Google OAuth',
              example: '123456789012345678901'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
              example: 'joao.silva@example.com'
            },
            firstName: {
              type: 'string',
              description: 'Nome do usuário',
              example: 'João'
            },
            lastName: {
              type: 'string',
              description: 'Sobrenome do usuário',
              example: 'Silva'
            },
            profilePicture: {
              type: 'string',
              description: 'URL da foto de perfil',
              example: 'https://example.com/profile.jpg'
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'Data de nascimento',
              example: '1990-05-15'
            },
            phoneNumber: {
              type: 'string',
              description: 'Número de telefone',
              example: '+5511999887766'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
              example: '2025-10-03T21:19:41.467Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização',
              example: '2025-10-03T21:19:41.467Z'
            }
          },
          example: {
            email: 'maria.santos@example.com',
            firstName: 'Maria',
            lastName: 'Santos',
            phoneNumber: '+5511888776655',
            dateOfBirth: '1985-03-20'
          }
        },
        Transaction: {
          type: 'object',
          required: ['userId', 'amount', 'description', 'category', 'type'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único da transação',
              example: '68e03db728d3da6c9a9e5e2d'
            },
            userId: {
              type: 'string',
              description: 'ID do usuário',
              example: '68e03edb66ac82d59a6febdf'
            },
            amount: {
              type: 'number',
              minimum: 0,
              description: 'Valor da transação',
              example: 1500.50
            },
            description: {
              type: 'string',
              description: 'Descrição da transação',
              example: 'Salário mensal'
            },
            category: {
              type: 'string',
              description: 'Categoria da transação',
              example: 'Trabalho'
            },
            type: {
              type: 'string',
              enum: ['income', 'expense'],
              description: 'Tipo da transação',
              example: 'income'
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Data da transação',
              example: '2025-10-03T21:16:00.568Z'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
              example: '2025-10-03T21:18:47.655Z'
            }
          },
          example: {
            userId: '68e03edb66ac82d59a6febdf',
            amount: 1500.50,
            description: 'Salário mensal',
            category: 'Trabalho',
            type: 'income',
            date: '2025-10-03T21:16:00.568Z'
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Mensagem de erro'
            },
            error: {
              type: 'string',
              description: 'Detalhes do erro'
            }
          }
        }
      }
    }
  },
  apis: [`${__dirname}/../routes/*.js`]
};

const specs = swaggerJSDoc(options);

module.exports = specs;
