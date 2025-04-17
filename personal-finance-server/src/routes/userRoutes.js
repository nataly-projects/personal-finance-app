const express = require("express");
const router = express.Router();
// const { registerUser, loginUser, getUserProfile, getUserDashboard } = require("../controllers/userController");
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");


router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/profile", authenticate, userController.getUserProfile);

router.get("/dashboard", authenticate, userController.getUserDashboard);

module.exports = router;
