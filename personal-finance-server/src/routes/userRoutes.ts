import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get("/settings", authenticate, userController.getUserSettings);
router.put("/settings", authenticate, userController.updateUserSettings);

router.get("/profile", authenticate, userController.getUserProfile);
router.put("/profile", authenticate, userController.updateUserProfile);
router.get("/dashboard", authenticate, userController.getUserDashboard);

router.post("/password/request-update", authenticate, userController.requestPasswordUpdate);
router.post("/password/verify-code-update", authenticate, userController.verifyPasswordUpdateCode);
router.put("/password/update", authenticate, userController.updatePassword);

router.post('/password/request-reset', userController.requestPasswordReset);
router.post('/password/verify-code-reset', userController.verifyResetCode);
router.post('/password/reset', userController.resetPassword);

export default router; 