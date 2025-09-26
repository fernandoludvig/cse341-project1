const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

// Health check endpoint
router.get('/health', authController.healthCheck);

// Authentication endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/profile', authController.verifyToken, authController.getCurrentUser);

module.exports = router;
