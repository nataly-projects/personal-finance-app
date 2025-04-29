import { useState, useEffect } from 'react';
import API from '../services/api';
import { TransactionData } from '../utils/types';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await API.get('/transactions');
        
        const transactionsWithDates = response.data.map((transaction: any) => ({
          ...transaction,
          date: new Date(transaction.date),
          createdAt: new Date(transaction.createdAt),
          updatedAt: transaction.updatedAt ? new Date(transaction.updatedAt) : null
        }));
        
        setTransactions(transactionsWithDates);
        setError(null);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const addTransaction = async (transaction: Omit<TransactionData, '_id'>) => {
    try {
      const response = await API.post('/transactions', transaction);
      const newTransaction = {
        ...response.data,
        date: new Date(response.data.date),
        createdAt: new Date(response.data.createdAt),
        updatedAt: response.data.updatedAt? new Date(response.data.updatedAt) : null
      };
      setTransactions(prev => [...prev, newTransaction]);
      return newTransaction;
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('Failed to add transaction. Please try again.');
      throw err;
    }
  };

  const updateTransaction = async (id: string, transaction: Partial<TransactionData>) => {
    try {
      const response = await API.put(`/transactions/${id}`, transaction);
      const updatedTransaction = {
        ...response.data,
        date: new Date(response.data.date),
        createdAt: new Date(response.data.createdAt),
        updatedAt: response.data.updatedAt ? new Date(response.data.updatedAt) : null
      };
      setTransactions(prev => prev.map(t => t._id === id ? updatedTransaction : t));
      return updatedTransaction;
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError('Failed to update transaction. Please try again.');
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await API.delete(`/transactions/${id}`);
      setTransactions(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction. Please try again.');
      throw err;
    }
  };

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
};
