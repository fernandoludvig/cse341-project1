const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('MONGODB_URI não encontrada nas variáveis de ambiente');
      console.log('Verifique se a variável MONGODB_URI está configurada no Render.com');
      console.log('Continuando sem MongoDB...');
      return null;
    }
    
    console.log('Tentando conectar ao MongoDB...');
    console.log('URI encontrada:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Mascarar credenciais no log
    
    // Configurações globais do Mongoose
    mongoose.set('bufferCommands', false);
    mongoose.set('bufferMaxEntries', 0);
    
    // Configurações do Mongoose para produção
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 segundos para seleção do servidor
      socketTimeoutMS: 45000, // 45 segundos para operações
      connectTimeoutMS: 10000, // 10 segundos para conexão
      maxPoolSize: 10, // Máximo de conexões no pool
      minPoolSize: 1, // Mínimo de conexões no pool
      maxIdleTimeMS: 30000, // 30 segundos de idle
      keepAlive: true,
      keepAliveInitialDelay: 300000,
      bufferMaxEntries: 0,
      bufferCommands: false,
    };
    
    const conn = await mongoose.connect(mongoUri, options);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
    
    // Configurar listeners para eventos de conexão
    mongoose.connection.on('error', (err) => {
      console.error('Erro de conexão MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB desconectado');
    });
    
    return conn;
  } catch (error) {
    console.error('Erro ao conectar MongoDB:', error.message);
    console.log('Continuando sem MongoDB...');
    return null;
  }
};

module.exports = connectDB;
