// Cria uma instância do Router do Express
// O Router é como um "mini-servidor" para definir rotas separadas do app principal
const router = require('express').Router();

// Define uma rota GET para o caminho '/' dentro deste router
// Quando alguém acessar a raiz desta rota, será executada a função de callback
router.get('/', (req, res) => {
    // Envia a resposta "Hello World" para o cliente
    res.send('Hello World');
});

router.use('/users', require('./user'));

// Exporta o router para que possa ser usado em outro arquivo, como app.js
module.exports = router;
