const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./docs/swagger');
const connectDB = require('./config/database');
const routes = require('./routes');

// Carregar variáveis de ambiente
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar trust proxy para produção (Render.com)
app.set('trust proxy', 1);

// Conectar ao MongoDB antes de iniciar o servidor
const startServer = async () => {
  try {
    const dbConnection = await connectDB();
    if (dbConnection) {
      console.log('Conexão com MongoDB estabelecida');
    } else {
      console.log('MongoDB não conectado, mas servidor iniciando...');
    }
  } catch (error) {
    console.error('Erro ao conectar MongoDB:', error);
    console.log('Continuando sem MongoDB...');
  }
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Muitas requisições, tente novamente em 15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true
});

app.use(helmet());
app.use(limiter);
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
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

// Iniciar servidor se não estiver sendo usado como middleware
if (require.main === module) {
  // Aguardar conexão com MongoDB antes de iniciar servidor
  startServer().then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Documentação disponível em: http://localhost:${PORT}/api-docs`);
    });
  }).catch((error) => {
    console.error('Erro ao iniciar servidor:', error);
    // Iniciar servidor mesmo com erro de MongoDB
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT} (sem MongoDB)`);
      console.log(`Documentação disponível em: http://localhost:${PORT}/api-docs`);
    });
  });
}

module.exports = app;
