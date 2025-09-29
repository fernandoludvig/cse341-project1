// Load environment variables
require('dotenv').config();

// Importa o módulo "express", que é um framework para criar servidores web em Node.js.
// Ele facilita a criação de rotas, middlewares e manipulação de requisições/respostas HTTP.
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongodb = require('./data/database');
const passport = require('./config/oauth');

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

// Session configuration for OAuth
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from frontend directory
app.use('/frontend', express.static('frontend'));
app.use(express.static('frontend'));

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// CORS configuration
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Users & Products API is running! Access /api-docs for documentation.',
    endpoints: {
      users: '/users',
      products: '/products',
      auth: '/auth',
      documentation: '/api-docs',
      frontend: '/frontend/auth.html',
      test: '/test-oauth.html'
    },
    version: '2.0.0'
  });
});

// Serve HTML pages
app.get('/test-oauth.html', (req, res) => {
  res.sendFile(__dirname + '/test-oauth.html');
});

app.get('/auth.html', (req, res) => {
  res.sendFile(__dirname + '/frontend/auth.html');
});

app.get('/simple-oauth-test.html', (req, res) => {
  res.sendFile(__dirname + '/simple-oauth-test.html');
});

// Mount routes
app.use('/', require('./routes'));

// Monta o Swagger UI em /api-docs (interativo - requisito do projeto)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Inicializa o MongoDB e inicia o servidor
mongodb.initDb((err) => {
    if (err) {
        console.log('MongoDB connection error:', err);
        console.log('Starting server without database connection...');
        app.listen(port, () => {
            console.log(`Server running on port ${port} (NO DATABASE)`);
            console.log(`Swagger docs available at: http://localhost:${port}/api-docs`);
        });
    } else {
        app.listen(port, () => {
            console.log(`Database connected, server running on port ${port}`);
            console.log(`Swagger docs available at: http://localhost:${port}/api-docs`);
        });
    }
});