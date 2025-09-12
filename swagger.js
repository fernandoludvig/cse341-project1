const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Users API',
    description: 'Users API'
  },
  host: 'localhost:3000',
  schemes: ['http', 'https']
};

const outputFile = './swagger.json';  // Gera na raiz do projeto
const endpointsFiles = ['./server.js', './routes/user.js'];  // Escaneia server.js (para mount /users) e user.js (rotas)

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger JSON gerado com sucesso! Paths corrigidos para /users.');
});