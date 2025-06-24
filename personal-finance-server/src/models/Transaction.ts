import mongoose, { Schema, Document } from 'mongoose';
import { Transaction as TransactionType } from '@shared/types/transaction';


export interface TransactionDocument extends Document, 
  Omit<TransactionType, 'id' | 'userId'> {
  userId: mongoose.Types.ObjectId;
}



const transactionSchema = new Schema<TransactionDocument>({
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: false
});

export const Transaction = mongoose.model<TransactionDocument>('Transaction', transactionSchema); 