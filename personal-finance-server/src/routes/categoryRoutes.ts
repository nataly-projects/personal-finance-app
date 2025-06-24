import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();


router.post('/', authenticate, categoryController.addCategory);
router.get('/', authenticate, categoryController.getCategories);
router.put('/:id', authenticate, categoryController.updateCategory);
router.delete('/:id', authenticate, categoryController.deleteCategory);

export default router; 