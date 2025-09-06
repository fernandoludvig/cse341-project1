// Importa o módulo "express", que é um framework para criar servidores web em Node.js.
// Ele facilita a criação de rotas, middlewares e manipulação de requisições/respostas HTTP.
const express = require('express');
const mongodb = require('./data/database');

// Cria uma instância do aplicativo Express, chamada "app".
// Esse objeto é o coração da aplicação: é nele que você define rotas, middlewares e configurações.
const app = express(); 

// Define a porta padrão como 3000.
// Caso não haja uma porta definida no ambiente (ex: Heroku define via variável de ambiente),
// o servidor rodará localmente na porta 3000.
const port = process.env.PORT || 3000;

// Registra todas as rotas definidas no arquivo "routes/index.js".
// O './routes' importa o módulo de rotas que você criou usando express.Router().
// O app.use('/', ...) significa que essas rotas estarão disponíveis a partir da raiz '/'.
app.use('/', require('./routes'));

mongodb.initDb((err) => {
    if(err) {
        console.log(err);
    }
    else {
        app.listen(port, () => {console.log(`Database is listening and node Running on port ${port}`)});

    }
});

