const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://fernandoludvig:082004Fe@cluster0.k8gunhp.mongodb.net/finance-tracker');
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Erro ao conectar MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
