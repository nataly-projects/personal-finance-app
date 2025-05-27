const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");


router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/profile", authenticate, userController.getUserProfile);

router.put("/profile", authenticate, userController.updateUserProfile);

router.get("/dashboard", authenticate, userController.getUserDashboard);

router.post("/password/request-update", authenticate, userController.requestPasswordUpdate);
router.post("/password/verify-code", authenticate, userController.verifyPasswordUpdateCode);
router.put("/password", authenticate, userController.updatePassword);

// Password reset routes (no authentication required)
router.post("/password/reset-request", userController.requestPasswordReset);
router.post("/password/verify-reset-code", userController.verifyResetCode);
router.post("/password/reset", userController.resetPassword);

module.exports = router;
