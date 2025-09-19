const express = require('express');
const router = express.Router();

// Import route modules
const userRoutes = require('./user');
const productRoutes = require('./product');

// Use route modules
router.use('/users', userRoutes);
router.use('/products', productRoutes);

module.exports = router;