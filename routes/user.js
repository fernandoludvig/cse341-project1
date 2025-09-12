const express = require('express');
const router = express.Router();

const userscontroller = require('../controllers/users');

// GET /users - Lista todos (isso já funciona)
router.get('/', userscontroller.getAll);

// GET /users/:id - Pega um por ID
router.get('/:id', userscontroller.getSingle);

// POST /users - Cria novo (isso deve resolver o 404 no POST)
router.post('/', userscontroller.createUser);

// PUT /users/:id - Atualiza por ID
router.put('/:id', userscontroller.updateUser);

// DELETE /users/:id - Deleta por ID
router.delete('/:id', userscontroller.deleteUser);

module.exports = router;