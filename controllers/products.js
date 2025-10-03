const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// GET all products
const getAll = async (req, res) => {
    try {
        console.log('getAll products called');
        const result = await mongodb.getDatabase().collection('products').find();
        const products = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(products);
    } catch (error) {
        console.error('Error in getAll products:', error);
        res.status(500).json({ error: 'Server error fetching products' });
    }
};

// GET single product by ID
const getSingle = async (req, res) => {
    try {
        const productId = req.params.id;
        console.log('getSingle product called with ID:', productId);
        if (!ObjectId.isValid(productId)) {
            console.log('Invalid product ID');
            return res.status(400).json({ error: 'Invalid product ID format' });
        }
        const productIdObj = new ObjectId(productId);
        const product = await mongodb.getDatabase().collection('products').findOne({ _id: productIdObj });
        if (!product) {
            console.log('Product not found');
            return res.status(404).json({ error: 'Product not found' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(product);
    } catch (error) {
        console.error('Error in getSingle product:', error);
        res.status(500).json({ error: 'Server error fetching product' });
    }
};

// POST new product
const createProduct = async (req, res) => {
    try {
        console.log('createProduct called with body:', req.body);
        const { name, description, price, category, inStock } = req.body;

        if (!name || !description || price === undefined || !category || inStock === undefined) {
            console.log('Validation failed: missing fields');
            return res.status(400).json({ error: 'All fields (name, description, price, category, inStock) are required' });
        }

        // Validate price is a number
        if (typeof price !== 'number' || price < 0) {
            return res.status(400).json({ error: 'Price must be a positive number' });
        }

        // Validate inStock is boolean
        if (typeof inStock !== 'boolean') {
            return res.status(400).json({ error: 'inStock must be true or false' });
        }

        // Validate name length
        if (name.length < 2 || name.length > 100) {
            return res.status(400).json({ error: 'Name must be between 2 and 100 characters' });
        }

        const product = {
            name,
            description,
            price,
            category,
            inStock,
            createdAt: new Date()
        };
        const response = await mongodb.getDatabase().collection('products').insertOne(product);
        if (response.acknowledged) {
            console.log('Product created with ID:', response.insertedId);
            res.status(201).json({ id: response.insertedId.toString() });
        } else {
            console.log('Insert failed');
            res.status(500).json({ error: 'Some error occurred while creating the product.' });
        }
    } catch (error) {
        console.error('Error in createProduct:', error);
        res.status(500).json({ error: 'Server error creating product' });
    }
};

// PUT update product by ID
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        console.log('updateProduct called with ID:', productId, 'body:', req.body);
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID format' });
        }
        const productIdObj = new ObjectId(productId);

        // Validate price if provided
        if (req.body.price !== undefined) {
            if (typeof req.body.price !== 'number' || req.body.price < 0) {
                return res.status(400).json({ error: 'Price must be a positive number' });
            }
        }

        // Validate inStock if provided
        if (req.body.inStock !== undefined) {
            if (typeof req.body.inStock !== 'boolean') {
                return res.status(400).json({ error: 'inStock must be true or false' });
            }
        }

        // Validate name if provided
        if (req.body.name) {
            if (req.body.name.length < 2 || req.body.name.length > 100) {
                return res.status(400).json({ error: 'Name must be between 2 and 100 characters' });
            }
        }

        const updates = { $set: {} };
        if (req.body.name) updates.$set.name = req.body.name;
        if (req.body.description) updates.$set.description = req.body.description;
        if (req.body.price !== undefined) updates.$set.price = req.body.price;
        if (req.body.category) updates.$set.category = req.body.category;
        if (req.body.inStock !== undefined) updates.$set.inStock = req.body.inStock;
        
        if (Object.keys(updates.$set).length === 0) {
            return res.status(400).json({ error: 'No fields provided to update' });
        }

        updates.$set.updatedAt = new Date();

        const response = await mongodb.getDatabase().collection('products').updateOne(
            { _id: productIdObj },
            updates
        );
        if (response.matchedCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        console.log('Product updated, modifiedCount:', response.modifiedCount);
        res.status(200).send();
    } catch (error) {
        console.error('Error in updateProduct:', error);
        res.status(500).json({ error: 'Some error occurred while updating the product.' });
    }
};

// DELETE product by ID
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        console.log('deleteProduct called with ID:', productId);
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID format' });
        }
        const productIdObj = new ObjectId(productId);
        const response = await mongodb.getDatabase().collection('products').deleteOne({ _id: productIdObj });
        if (response.deletedCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        console.log('Product deleted');
        res.status(200).send();
    } catch (error) {
        console.error('Error in deleteProduct:', error);
        res.status(500).json({ error: 'Some error occurred while deleting the product.' });
    }
};

module.exports = {
    getAll,
    getSingle,
    createProduct,
    updateProduct,
    deleteProduct
};
