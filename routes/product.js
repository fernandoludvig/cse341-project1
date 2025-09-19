const express = require('express');
const router = express.Router();

const productsController = require('../controllers/products');

// GET /products - List all products
router.get('/', productsController.getAll);

// GET /products/:id - Get product by ID
router.get('/:id', productsController.getSingle);

// POST /products - Create new product
router.post('/', productsController.createProduct);

// PUT /products/:id - Update product by ID
router.put('/:id', productsController.updateProduct);

// DELETE /products/:id - Delete product by ID
router.delete('/:id', productsController.deleteProduct);

module.exports = router;
