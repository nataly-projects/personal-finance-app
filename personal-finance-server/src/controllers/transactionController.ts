import { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';
import { logger } from '../utils/logger';
import {
  AddTransactionRequest,
  AddTransactionResponse,
  GetTransactionsResponse,
  UpdateTransactionRequest,
  UpdateTransactionResponse,
  DeleteTransactionResponse
} from '@shared/types/transaction';


interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export const addTransaction = async (req: AuthenticatedRequest, res: Response<AddTransactionResponse>) => {
    const userId = req.user.id;
  try {
    const { amount, categoryId, type, description, date } = req.body as AddTransactionRequest;
    
    if (!amount || !categoryId || !type || !description || !date) {
      logger.warn("Add transaction failed: Missing fields");
      return res.status(400).json({ success: false, error: "All fields are required" });
    }
    
    if (type !== "income" && type !== "expense") {
      logger.warn("Add transaction failed: Invalid transaction type");
      return res.status(400).json({ success: false, error: "Transaction type must be 'income' or 'expense'" });
    }
    
    if (isNaN(amount) || amount <= 0) {
      logger.warn("Add transaction failed: Invalid amount");
      return res.status(400).json({ success: false, error: "Amount must be a positive number" });
    }
    
    const transaction = new Transaction({ 
      amount,
      categoryId,
      type,
      description,
      date,
      userId: userId 
    });
    
    await transaction.save();
    logger.info(`Transaction added successfully for user ID: ${userId}`);
    res.status(201).json({
      success: true,
      transaction: {
        id: transaction._id.toString(),
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
        categoryId: transaction.categoryId,
        userId: transaction.userId,
        type: transaction.type,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt
      }
    });
  } catch (error) {
    logger.error(`Error adding transaction for user ID: ${userId}:`, error);
    res.status(500).json({ success: false, error: "Server error, please try again later" });
  }
};

export const getTransactions = async (req: AuthenticatedRequest, res: Response<GetTransactionsResponse>) => {
    const userId = req.user.id;
  try {
    const transactions = await Transaction.find({ userId: userId })
      .sort({ date: -1 }); 
    
    if (!transactions || transactions.length === 0) {
      logger.info(`No transactions found for user ID: $userId}`);
      return res.status(200).json({ success: true, transactions: [] });
    }

    logger.info(`Transactions fetched successfully for user ID: ${userId}`);
    res.status(200).json({
      success: true,
      transactions: transactions.map(t => ({
        id: t._id.toString(),
        amount: t.amount,
        description: t.description,
        date: t.date,
        categoryId: t.categoryId,
        userId: t.userId,
        type: t.type,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt
      }))
    });
  } catch (error) {
    logger.error(`Error fetching transactions for user ID: ${userId}:`, error);
    res.status(500).json({ success: false, error: "Server error, please try again later" });
  }
};

export const updateTransaction = async (req: AuthenticatedRequest, res: Response<UpdateTransactionResponse>) => {
    const userId = req.user.id;
    const { id } = req.params;
  try {
    
    const updateData = req.body as UpdateTransactionRequest;

    const existingTransaction = await Transaction.findOne({
      _id: id,
      userId: userId
    });
    
    if (!existingTransaction) {
      logger.warn(`Update transaction failed: Transaction not found for ID: ${id}`);
      return res.status(404).json({ success: false, error: "Transaction not found" });
    }

    if (updateData.amount !== undefined && (isNaN(updateData.amount) || updateData.amount <= 0)) {
      logger.warn(`Update transaction failed: Invalid amount for ID: ${id}`);
      return res.status(400).json({ success: false, error: "Amount must be a positive number" });
    }

    if (updateData.type !== undefined && updateData.type !== "income" && updateData.type !== "expense") {
      logger.warn(`Update transaction failed: Invalid transaction type for ID: ${id}`);
      return res.status(400).json({ success: false, error: "Transaction type must be 'income' or 'expense'" });
    }
    
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    
    if (!transaction) {
      logger.warn(`Update transaction failed: Transaction not found for ID: ${id}`);
      return res.status(404).json({ success: false, error: "Transaction not found" });
    }

    logger.info(`Transaction updated successfully for ID: ${id}`);
    res.status(200).json({
      success: true,
      transaction: {
        id: transaction._id.toString(),
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
        categoryId: transaction.categoryId,
        userId: transaction.userId,
        type: transaction.type,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt
      }
    });
  } catch (error) {
    logger.error(`Error updating transaction for ID: ${id}:`, error);
    res.status(500).json({ success: false, error: "Server error, please try again later" });
  }
};

export const deleteTransaction = async (req: AuthenticatedRequest, res: Response<DeleteTransactionResponse>) => {
    const userId = req.user.id;
    const { id } = req.params;
  try {
    const transaction = await Transaction.findOne({
      _id: id,
      userId: userId
    });
    
    if (!transaction) {
      logger.warn(`Delete transaction failed: Transaction not found for ID: ${id}`);
      return res.status(404).json({ success: false, error: "Transaction not found" });
    }
    
    await Transaction.findByIdAndDelete(id);
    logger.info(`Transaction deleted successfully for ID: ${id}`);
    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(`Error deleting transaction for ID ${id}:`, error);
    res.status(500).json({ success: false, error: "Server error, please try again later" });
  }
}; 