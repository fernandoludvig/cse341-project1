const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const transactionRoutes = require('./transactionRoutes');

router.use('/users', userRoutes);
router.use('/transactions', transactionRoutes);

module.exports = router;
