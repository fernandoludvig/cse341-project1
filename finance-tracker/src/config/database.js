const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://fernandoludvig:082004Fe@cluster0.k8gunhp.mongodb.net/finance-tracker';
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Erro ao conectar MongoDB:', error.message);
    console.log('Continuando sem MongoDB...');
    return null;
  }
};

module.exports = connectDB;
