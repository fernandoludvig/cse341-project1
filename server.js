// Load environment variables
require('dotenv').config();

console.log('Environment check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- MONGODB_URL:', process.env.MONGODB_URL ? 'SET' : 'NOT SET');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('- GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET');
console.log('- GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET');

// Importa o módulo "express", que é um framework para criar servidores web em Node.js.
// Ele facilita a criação de rotas, middlewares e manipulação de requisições/respostas HTTP.
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongodb = require('./data/database');

// Load OAuth configuration with error handling
let passport;
try {
    passport = require('./config/oauth');
    console.log('OAuth configuration loaded successfully');
} catch (error) {
    console.error('Error loading OAuth configuration:', error);
    console.log('Continuing without OAuth...');
}

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

// Initialize Passport (if available)
if (passport) {
    app.use(passport.initialize());
    app.use(passport.session());
    console.log('Passport initialized successfully');
} else {
    console.log('Passport not available - OAuth endpoints will return errors');
}

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

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`,
        timestamp: new Date().toISOString()
    });
});

// Inicializa o MongoDB e inicia o servidor
try {
    mongodb.initDb((err) => {
        if (err) {
            console.log('MongoDB connection error:', err);
            console.log('Starting server without database connection...');
            startServer('NO DATABASE');
        } else {
            console.log('Database connected successfully');
            startServer('WITH DATABASE');
        }
    });
} catch (error) {
    console.error('Error initializing MongoDB:', error);
    console.log('Starting server without database...');
    startServer('NO DATABASE - ERROR');
}

function startServer(status) {
    try {
        app.listen(port, () => {
            console.log(`✅ Server running on port ${port} (${status})`);
            console.log(`📚 Swagger docs available at: http://localhost:${port}/api-docs`);
            console.log(`🔐 OAuth test page: http://localhost:${port}/simple-oauth-test.html`);
        });
    } catch (error) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
}