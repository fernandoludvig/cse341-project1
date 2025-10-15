const express = require('express');
const router = express.Router();

const productsController = require('../controllers/products');
const authController = require('../controllers/auth');

// GET /products - List all products (public)
router.get('/', productsController.getAll);

// GET /products/:id - Get product by ID (public)
router.get('/:id', productsController.getSingle);

// POST /products - Create new product (requires OAuth)
router.post('/', authController.oauthRequired, productsController.createProduct);

// PUT /products/:id - Update product by ID (requires OAuth)
router.put('/:id', authController.oauthRequired, productsController.updateProduct);

// DELETE /products/:id - Delete product by ID (requires OAuth)
router.delete('/:id', authController.oauthRequired, productsController.deleteProduct);

module.exports = router;
