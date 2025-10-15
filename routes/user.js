const express = require('express');
const router = express.Router();

const userscontroller = require('../controllers/users');
const authController = require('../controllers/auth');

// GET /users - Lista todos (requires OAuth)
router.get('/', authController.oauthRequired, userscontroller.getAll);

// GET /users/:id - Pega um por ID (requires OAuth)
router.get('/:id', authController.oauthRequired, userscontroller.getSingle);

// POST /users - Cria novo (requires OAuth)
router.post('/', authController.oauthRequired, userscontroller.createUser);

// PUT /users/:id - Atualiza por ID (requires OAuth)
router.put('/:id', authController.oauthRequired, userscontroller.updateUser);

// DELETE /users/:id - Deleta por ID (requires OAuth)
router.delete('/:id', authController.oauthRequired, userscontroller.deleteUser);

module.exports = router;