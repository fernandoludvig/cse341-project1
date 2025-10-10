const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./docs/swagger');
const swaggerOptions = require('../swagger-config');
const connectDB = require('./config/database');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao MongoDB de forma assíncrona sem bloquear
connectDB().catch(err => {
  console.error('Erro ao conectar MongoDB:', err);
  console.log('Continuando sem MongoDB...');
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Muitas requisições, tente novamente em 15 minutos'
  }
});

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(limiter);
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, swaggerOptions));
app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Finance Tracker API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado'
  });
});

app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Não iniciar servidor aqui, será usado como middleware
// app.listen(PORT, () => {
//   console.log(`Servidor rodando na porta ${PORT}`);
//   console.log(`Documentação disponível em: http://localhost:${PORT}/api-docs`);
// });

module.exports = app;
