const express = require('express');
const router = express.Router();

// Import route modules
const userRoutes = require('./user');
const productRoutes = require('./product');
const authRoutes = require('./auth');

// Use route modules
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/auth', authRoutes);

module.exports = router;