const express = require('express');
const router = express.Router();

const userscontroller = require('../controllers/users');
const authController = require('../controllers/auth');

// GET /users - Lista todos (requires auth)
router.get('/', authController.verifyToken, userscontroller.getAll);

// GET /users/:id - Pega um por ID (requires auth)
router.get('/:id', authController.verifyToken, userscontroller.getSingle);

// POST /users - Cria novo (requires auth)
router.post('/', authController.verifyToken, userscontroller.createUser);

// PUT /users/:id - Atualiza por ID (requires auth)
router.put('/:id', authController.verifyToken, userscontroller.updateUser);

// DELETE /users/:id - Deleta por ID (requires auth)
router.delete('/:id', authController.verifyToken, userscontroller.deleteUser);

module.exports = router;