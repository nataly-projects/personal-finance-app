const express = require("express");
const router = express.Router();
const { getUserTasks, addUserTask, updateUserTask, deleteUserTask } = require("../controllers/taskController");
const { authenticate } = require("../middleware/authMiddleware");

router.get("/", authenticate, getUserTasks);
router.post("/", authenticate, addUserTask);
router.put("/:taskId", authenticate, updateUserTask);
router.delete("/:taskId", authenticate, deleteUserTask);

module.exports = router; 