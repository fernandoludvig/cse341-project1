const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('MONGODB_URI não encontrada nas variáveis de ambiente');
      console.log('Continuando sem MongoDB...');
      return null;
    }
    
    // Configurações globais do Mongoose
    mongoose.set('bufferCommands', false);
    mongoose.set('bufferMaxEntries', 0);
    
    // Configurações do Mongoose para produção
    const options = {
      serverSelectionTimeoutMS: 5000, // 5 segundos para seleção do servidor
      socketTimeoutMS: 45000, // 45 segundos para operações
      connectTimeoutMS: 10000, // 10 segundos para conexão
      maxPoolSize: 10, // Máximo de conexões no pool
      minPoolSize: 5, // Mínimo de conexões no pool
      maxIdleTimeMS: 30000, // 30 segundos de idle
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
