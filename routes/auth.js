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

// OAuth endpoints
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);
router.post('/oauth/logout', authController.oauthLogout);

module.exports = router;
