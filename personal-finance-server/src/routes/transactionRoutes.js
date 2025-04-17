const express = require("express");
const router = express.Router();
const { addTransaction, getTransactions, updateTransaction,
 deleteTransaction } = require("../controllers/transactionController");
 const { authenticate } = require("../middleware/authMiddleware");

router.post("/", authenticate, addTransaction);
router.get("/", authenticate, getTransactions);
router.put("/:id", authenticate, updateTransaction);
router.delete("/:id", authenticate, deleteTransaction);

module.exports = router;
