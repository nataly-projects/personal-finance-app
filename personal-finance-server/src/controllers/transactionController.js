const Transaction = require("../models/Transaction");
const logger = require('../logger');

async function addTransaction (req, res) {
  try {
    const { amount, category, type, description } = req.body;
    
    if (!amount || !category || !type || !description) {
      logger.warn("Add transaction failed: Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }
    
    if (type !== "income" && type !== "expense") {
      logger.warn("Add transaction failed: Invalid transaction type");
      return res.status(400).json({ message: "Transaction type must be 'income' or 'expense'" });
    }
    
    if (isNaN(amount) || amount <= 0) {
      logger.warn("Add transaction failed: Invalid amount");
      return res.status(400).json({ message: "Amount must be a positive number" });
    }
    
    const transaction = new Transaction({ 
      ...req.body, 
      userId: req.user.id 
    });
    
    await transaction.save();
    logger.info(`Transaction added successfully for user ID: ${req.user.id}`);
    res.status(201).json(transaction);
  } catch (error) {
    logger.error(`Error adding transactionfor user ID: ${req.user.id}:`, error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

async function getTransactions (req, res) {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ date: -1 }); 
    
    logger.info(`Transactions fetched successfully for user ID: ${req.user.id}`);

    res.status(200).json(transactions);
  } catch (error) {
    logger.error(`Error fetching transactionsfor user ID: ${req.user.id}:`, error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

async function updateTransaction (req, res) {
  try {
    const existingTransaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!existingTransaction) {
      logger.warn(`Update transaction failed: Transaction not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: "Transaction not found" });
    }
    
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    logger.info(`Transaction updated successfully for ID: ${req.params.id}`);
    res.status(200).json(transaction);
  } catch (error) {
    logger.error(`Error updating transaction for ID: ${req.params.id}:`, error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

async function deleteTransaction (req, res) {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!transaction) {
      logger.warn(`Delete transaction failed: Transaction not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: "Transaction not found" });
    }
    
    await Transaction.findByIdAndDelete(req.params.id);
    logger.info(`Transaction deleted successfully for ID: ${req.params.id}`);
    res.status(200).json({ message: "העסקה נמחקה בהצלחה" });
  } catch (error) {
    console.error(`Error deleting transaction for ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
}