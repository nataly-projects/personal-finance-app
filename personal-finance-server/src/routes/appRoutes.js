const express = require('express');

const userRoutes = require('./userRoutes');
const transactionRoutes = require("./transactionRoutes");
const categoryRoutes = require("./categoryRoutes");
const taskRoutes = require("./taskRoutes");

const router = express.Router();

router.use('/users/', userRoutes);
router.use('/transactions/', transactionRoutes);
router.use('/categories/', categoryRoutes);
router.use('/tasks/', taskRoutes);

module.exports = router;