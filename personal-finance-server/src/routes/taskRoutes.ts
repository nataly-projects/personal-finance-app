import { Router } from 'express';
import * as taskController from '../controllers/taskController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticate, taskController.addTask);
router.get('/', authenticate, taskController.getTasks);
router.put('/:id', authenticate, taskController.updateTask);
router.delete('/:id', authenticate, taskController.deleteTask);

export default router; 