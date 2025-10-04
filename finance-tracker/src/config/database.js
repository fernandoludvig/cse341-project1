const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('MONGODB_URI não encontrada nas variáveis de ambiente');
      console.log('Continuando sem MongoDB...');
      return null;
    }
    
    // Configurações do Mongoose para produção
    const options = {
      serverSelectionTimeoutMS: 30000, // 30 segundos
      socketTimeoutMS: 45000, // 45 segundos
      bufferMaxEntries: 0,
      bufferCommands: false,
    };
    
    const conn = await mongoose.connect(mongoUri, options);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Erro ao conectar MongoDB:', error.message);
    console.log('Continuando sem MongoDB...');
    return null;
  }
};

module.exports = connectDB;
