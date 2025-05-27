import API from './api';
import { TransactionData } from '../utils/types';

export const fetchTransactions = async (): Promise<TransactionData[]> => {
  const response = await API.get('/transactions');
  return response.data.map((transaction: any) => ({
    ...transaction,
    date: new Date(transaction.date),
    createdAt: new Date(transaction.createdAt),
    updatedAt: transaction.updatedAt ? new Date(transaction.updatedAt) : null,
  }));
};

export const addTransaction = async (transaction: Omit<TransactionData, '_id'>): Promise<TransactionData> => {
  const response = await API.post('/transactions', transaction);
  return {
    ...response.data,
    date: new Date(response.data.date),
    createdAt: new Date(response.data.createdAt),
    updatedAt: response.data.updatedAt ? new Date(response.data.updatedAt) : null,
  };
};

export const updateTransaction = async (id: string, transaction: Partial<TransactionData>): Promise<TransactionData> => {
  const response = await API.put(`/transactions/${id}`, transaction);
  return {
    ...response.data,
    date: new Date(response.data.date),
    createdAt: new Date(response.data.createdAt),
    updatedAt: response.data.updatedAt ? new Date(response.data.updatedAt) : null,
  };
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await API.delete(`/transactions/${id}`);
};