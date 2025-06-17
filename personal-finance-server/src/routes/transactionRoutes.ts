import { Router } from 'express';
import * as transactionController from '../controllers/transactionController';
import { authenticate } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '@shared/types/auth';

const router = Router();

router.post('/', authenticate, transactionController.addTransaction);
router.get('/', authenticate, transactionController.getTransactions);
router.put('/:id', authenticate, transactionController.updateTransaction);
router.delete('/:id', authenticate, transactionController.deleteTransaction);

export default router; 