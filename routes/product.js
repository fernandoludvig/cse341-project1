const express = require('express');
const router = express.Router();

const productsController = require('../controllers/products');
const authController = require('../controllers/auth');

// GET /products - List all products (public)
router.get('/', productsController.getAll);

// GET /products/:id - Get product by ID (public)
router.get('/:id', productsController.getSingle);

// POST /products - Create new product (requires auth)
router.post('/', authController.verifyToken, productsController.createProduct);

// PUT /products/:id - Update product by ID (requires auth)
router.put('/:id', authController.verifyToken, productsController.updateProduct);

// DELETE /products/:id - Delete product by ID (requires auth)
router.delete('/:id', authController.verifyToken, productsController.deleteProduct);

module.exports = router;
