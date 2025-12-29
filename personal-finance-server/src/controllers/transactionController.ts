import { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';
import { User, UserDocument } from '../models/User';
import { logger } from '../utils/logger';
import {
  AddTransactionRequest,
  AddTransactionResponse,
  GetTransactionsResponse,
  UpdateTransactionRequest,
  UpdateTransactionResponse,
  DeleteTransactionResponse
} from '@shared/types/transaction';
import {sendOutcomeLimitExceededEmail} from '../services/mailService';
import { ApiError } from '../utils/utils';
import { asyncHandler } from '../middleware/errorMiddleware';
import { AuthenticatedRequest } from '../utils/types';


const checkAndNotifyBudgetLimit = async ({
  user,
  date,
}: {
  user: UserDocument;
  date: Date;
}) => {
  if (!user?.settings || !user.settings.enableOutcomeAlert || user.settings.monthlyOutcomeLimit == null) return;

  const monthStart = new Date(date);
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthEnd = new Date(monthStart);
  monthEnd.setMonth(monthStart.getMonth() + 1);

  const expensesThisMonth = await Transaction.aggregate([
    {
      $match: {
        userId: user._id,
        type: 'expense',
        date: { $gte: monthStart, $lt: monthEnd },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ]);

  const total = expensesThisMonth[0]?.total || 0;

  if (total > user.settings.monthlyOutcomeLimit) {
    await sendOutcomeLimitExceededEmail({
      email: user.email,
      userName: user.fullName,
      limit: user.settings.monthlyOutcomeLimit,
      currentTotal: total,
    });
  }
};


export const addTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response<AddTransactionResponse>) => {
  const userId = req.user.id;
  const { amount, category, type, description, date } = req.body as AddTransactionRequest;

  if (!amount || !category || !type || !description || !date) {
    logger.warn("Add transaction failed: Missing fields");
    throw new ApiError(400, "All fields are required");
  }

  if (type !== "income" && type !== "expense") {
    logger.warn("Add transaction failed: Invalid transaction type");
    throw new ApiError(400, "Transaction type must be 'income' or 'expense'");
  }

  if (isNaN(amount) || amount <= 0) {
    logger.warn("Add transaction failed: Invalid amount");
    throw new ApiError(400, "Amount must be a positive number");
  }

  const transaction = new Transaction({
    amount,
    category,
    type,
    description,
    date,
    userId
  });

  await transaction.save();

  const user = await User.findById(userId);
  if (user) {
    await checkAndNotifyBudgetLimit({ user, date });
  }

  logger.info(`Transaction added successfully for user ID: ${userId}`);
  
  res.status(201).json({
    success: true,
    transaction: transaction.toObject() as any   
  });
});

export const getTransactions = asyncHandler(async (req: AuthenticatedRequest, res: Response<GetTransactionsResponse>) => {
  const userId = req.user.id;

  const transactions = await Transaction.find({ userId }).sort({ date: -1 });

  if (!transactions || transactions.length === 0) {
    logger.info(`No transactions found for user ID: $userId}`);
    return res.status(200).json({ success: true, transactions: [] });
  }

  logger.info(`Transactions fetched for user ID: ${userId}`);
  
  res.status(200).json({
    success: true,
    transactions: transactions.map(t => t.toObject()) as any
  });
});


export const updateTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response<UpdateTransactionResponse>) => {
  const userId = req.user.id;
  const { id } = req.params;
  const updateData = req.body as UpdateTransactionRequest;

  const existingTransaction = await Transaction.findOne({ _id: id, userId });

  if (!existingTransaction) {
    logger.warn(`Update transaction failed: Transaction not found for ID: ${id}`);
    throw new ApiError(404, "Transaction not found");
  }

  if (updateData.amount !== undefined && (isNaN(updateData.amount) || updateData.amount <= 0)) {
    logger.warn(`Update transaction failed: Invalid amount for ID: ${id}`);
    throw new ApiError(400, "Amount must be a positive number");
  }

  const transaction = await Transaction.findByIdAndUpdate(
    id,
    { ...updateData, updatedAt: new Date() },
    { new: true }
  );

  if (!transaction){
    logger.warn(`Update transaction failed: Transaction not found for ID: ${id}`);
    throw new ApiError(404, "Transaction not found during update");
  } 

  logger.info(`Transaction updated: ${id}`);
  res.status(200).json({
    success: true,
    transaction: transaction.toObject() as any
  });
});


export const deleteTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response<DeleteTransactionResponse>) => {
  const { id } = req.params;
  const userId = req.user.id;

  const transaction = await Transaction.findOne({ 
    _id: id, userId });

  if (!transaction) {
    logger.warn(`Delete transaction failed: Transaction not found for ID: ${id}`);
    throw new ApiError(404, "Transaction not found");
  }

  await Transaction.findByIdAndDelete(id);
  
  logger.info(`Transaction deleted: ${id}`);
  res.status(200).json({ success: true });
});