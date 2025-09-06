const express = require('express');
const router = express.Router();

const userscontroller = require('../controllers/users');

router.get('/', userscontroller.getAll);

router.get('/', userscontroller.getSingle);

module.exports = router;