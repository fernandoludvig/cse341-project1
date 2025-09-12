// Importa o módulo "express", que é um framework para criar servidores web em Node.js.
// Ele facilita a criação de rotas, middlewares e manipulação de requisições/respostas HTTP.
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');

// Adições para Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // O JSON gerado pelo swagger.js

// Cria uma instância do aplicativo Express, chamada "app".
// Esse objeto é o coração da aplicação: é nele que você define rotas, middlewares e configurações.
const app = express(); 

// Define a porta padrão como 3000.
// Caso não haja uma porta definida no ambiente (ex: Heroku/Render define via variável de ambiente),
// o servidor rodará localmente na porta 3000.
const port = process.env.PORT || 3000;

// Middleware para parsear JSON no body das requests
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Monta as rotas em /users (ex: GET /users, POST /users, GET /users/:id)
app.use('/users', require('./routes'));

// Rota raiz simples para evitar 404 no Swagger ou acessos diretos
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Users API is running! Acesse /api-docs para documentação.' 
  });
});

// Monta o Swagger UI em /api-docs (interativo - requisito do projeto)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Inicializa o MongoDB e inicia o servidor
mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`Database connected, server running on port ${port}`);
            console.log(`Swagger docs disponíveis em: http://localhost:${port}/api-docs`);
        });
    }
});