const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { body } = require('express-validator');

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email deve ser válido')
];

const tokenValidation = [
  body('userId').isMongoId().withMessage('userId deve ser um ID válido')
];

router.post('/login', loginValidation, authController.login);

router.post('/token', tokenValidation, authController.generateTestToken);

router.get('/profile', requireAuth, authController.getProfile);

module.exports = router;

