const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');

let database;

const initDb = (callback) => {
    if (database) {
        console.log('Db is already initialized!');
        return callback(null, database);
    }

    MongoClient.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        database = client.db('users'); // MUDE AQUI: Nome do seu banco (ex: 'mydb' ou 'test')
        console.log('Database initialized with DB:', database.databaseName);
        callback(null, database); 
    })
    .catch((err) => {
        console.error('Database connection failed', err);
        callback(err);
    });
};

const getDatabase = () => {
    if (!database) {
        throw Error('Database not initialized');
    }
    return database;
};

module.exports = {
    initDb,
    getDatabase
};