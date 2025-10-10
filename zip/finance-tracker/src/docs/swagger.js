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
        Category: {
          type: 'object',
          required: ['userId', 'name', 'type', 'color'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único da categoria',
              example: '507f1f77bcf86cd799439011'
            },
            userId: {
              type: 'string',
              description: 'ID do usuário proprietário da categoria',
              example: '507f1f77bcf86cd799439011'
            },
            name: {
              type: 'string',
              description: 'Nome da categoria',
              example: 'Alimentação'
            },
            type: {
              type: 'string',
              enum: ['income', 'expense'],
              description: 'Tipo da categoria',
              example: 'expense'
            },
            budgetLimit: {
              type: 'number',
              minimum: 0,
              nullable: true,
              description: 'Limite do orçamento para a categoria',
              example: 500.00
            },
            color: {
              type: 'string',
              pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
              description: 'Cor da categoria em formato hexadecimal',
              example: '#FF5733'
            },
            isDefault: {
              type: 'boolean',
              description: 'Se é uma categoria padrão do sistema',
              example: false
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação da categoria',
              example: '2025-10-10T21:19:41.467Z'
            }
          },
          example: {
            userId: '507f1f77bcf86cd799439011',
            name: 'Alimentação',
            type: 'expense',
            budgetLimit: 500.00,
            color: '#FF5733',
            isDefault: false
          }
        },
        BudgetCategory: {
          type: 'object',
          required: ['categoryId', 'budgetedAmount'],
          properties: {
            categoryId: {
              type: 'string',
              description: 'ID da categoria',
              example: '507f1f77bcf86cd799439011'
            },
            budgetedAmount: {
              type: 'number',
              minimum: 0,
              description: 'Valor orçado para a categoria',
              example: 300.00
            },
            spentAmount: {
              type: 'number',
              minimum: 0,
              description: 'Valor gasto na categoria',
              example: 250.00
            }
          }
        },
        Budget: {
          type: 'object',
          required: ['userId', 'month', 'year', 'totalBudget'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único do orçamento',
              example: '507f1f77bcf86cd799439022'
            },
            userId: {
              type: 'string',
              description: 'ID do usuário proprietário do orçamento',
              example: '507f1f77bcf86cd799439011'
            },
            month: {
              type: 'integer',
              minimum: 1,
              maximum: 12,
              description: 'Mês do orçamento',
              example: 10
            },
            year: {
              type: 'integer',
              minimum: 2000,
              description: 'Ano do orçamento',
              example: 2025
            },
            totalBudget: {
              type: 'number',
              minimum: 0,
              description: 'Orçamento total',
              example: 2000.00
            },
            totalSpent: {
              type: 'number',
              minimum: 0,
              description: 'Total gasto',
              example: 1500.00
            },
            categories: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/BudgetCategory'
              },
              description: 'Categorias com orçamentos específicos'
            },
            notes: {
              type: 'string',
              description: 'Notas sobre o orçamento',
              example: 'Orçamento para viagem de férias'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do orçamento',
              example: '2025-10-10T21:19:41.467Z'
            },
            remainingBudget: {
              type: 'number',
              description: 'Orçamento restante (campo virtual)',
              example: 500.00
            },
            utilizationPercentage: {
              type: 'integer',
              description: 'Percentual de utilização do orçamento (campo virtual)',
              example: 75
            }
          },
          example: {
            userId: '507f1f77bcf86cd799439011',
            month: 10,
            year: 2025,
            totalBudget: 2000.00,
            totalSpent: 1500.00,
            categories: [
              {
                categoryId: '507f1f77bcf86cd799439012',
                budgetedAmount: 500.00,
                spentAmount: 400.00
              }
            ],
            notes: 'Orçamento mensal de outubro'
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
