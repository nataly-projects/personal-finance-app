import express, { Router } from 'express';
import userRoutes from './userRoutes';
import transactionRoutes from './transactionRoutes';
import categoryRoutes from './categoryRoutes';
import taskRoutes from './taskRoutes';

const router: Router = express.Router();

router.use('/users/', userRoutes);
router.use('/transactions/', transactionRoutes);
router.use('/categories/', categoryRoutes);
router.use('/tasks/', taskRoutes);

export default router; 