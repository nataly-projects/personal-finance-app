const express = require("express");
const router = express.Router();
const { addCategory, getCategories, deleteCategory } = require("../controllers/categoryController");
const { authenticate } = require("../middleware/authMiddleware");


router.post("/", authenticate, addCategory);
router.get("/", authenticate, getCategories);
router.delete("/:id", authenticate, deleteCategory);

module.exports = router;