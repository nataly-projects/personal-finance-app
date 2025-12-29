// import { useCallback } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/store';
// import { 
//   setTransactions, 
//   addTransaction, 
//   updateTransaction, 
//   deleteTransaction,
//   setLoading,
//   setError,
//   setOperationLoading
// } from '../store/transactionsSlice';
// import API from '../services/api';
// import { TransactionData, TransactionFormData } from '../utils/types';

// interface TransactionsResponse {
//   transactions: any[];
//   success: boolean;
// }

// const parseTransactionDates = (transaction: any): TransactionData => ({
//   ...transaction,
//   date: new Date(transaction.date),
//   createdAt: new Date(transaction.createdAt),
//   updatedAt: transaction.updatedAt ? new Date(transaction.updatedAt) : null
// });

// export const useTransactions = () => {
//   const dispatch = useDispatch();
//   const { items: transactions, loading, error, operationLoading } = useSelector((state: RootState) => state.transactions);

//   const fetchTransactions = useCallback(async () => {
//     try {
//       dispatch(setLoading(true));
//       dispatch(setError(null));
//       const response = await API.get<TransactionsResponse>('/transactions');
//       const transactionsWithDates = (response.data.transactions || []).map(parseTransactionDates);
//       dispatch(setTransactions(transactionsWithDates));
//     } catch (err) {
//       console.error('Error fetching transactions:', err);
//       dispatch(setError('Failed to load transactions. Please try again later.'));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }, [dispatch]);

//   const addTransactionToServer = async (transaction: TransactionFormData) => {
//     let optimisticTransaction: TransactionData | undefined;
    
//     try {
//       dispatch(setOperationLoading({ operation: 'add', loading: true }));
//       dispatch(setError(null));

//       optimisticTransaction = {
//         _id: 'temp-' + Date.now(),
//         ...transaction,
//         date: transaction.date || new Date(),
//         createdAt: new Date(),
//         updatedAt: null
//       } as TransactionData;

//       dispatch(addTransaction(optimisticTransaction));

//       const response = await API.post('/transactions', transaction);
//       const newTransaction = parseTransactionDates(response.data);

//       dispatch(updateTransaction(newTransaction));
//       return newTransaction;
//     } catch (err) {
//       console.error('Error adding transaction:', err);
//       if (optimisticTransaction) {
//         dispatch(deleteTransaction(optimisticTransaction._id));
//       }
//       dispatch(setError('Failed to add transaction. Please try again.'));
//       throw err;
//     } finally {
//       dispatch(setOperationLoading({ operation: 'add', loading: false }));
//     }
//   };

//   const updateTransactionInServer = async (id: string, transaction: Partial<TransactionData>) => {
//     let currentTransaction: TransactionData | undefined;
    
//     try {
//       dispatch(setOperationLoading({ operation: 'update', loading: true }));
//       dispatch(setError(null));

//       currentTransaction = transactions.find(t => t._id === id);
//       if (currentTransaction) {
//         const updatedTransaction = {
//           ...currentTransaction,
//           ...transaction,
//           updatedAt: new Date()
//         };
//         dispatch(updateTransaction(updatedTransaction));
//       }

//       const response = await API.put(`/transactions/${id}`, transaction);
//       const updatedTransaction = parseTransactionDates(response.data);

//       dispatch(updateTransaction(updatedTransaction));
//       return updatedTransaction;
//     } catch (err) {
//       console.error('Error updating transaction:', err);
//       if (currentTransaction) {
//         dispatch(updateTransaction(currentTransaction));
//       }
//       dispatch(setError('Failed to update transaction. Please try again.'));
//       throw err;
//     } finally {
//       dispatch(setOperationLoading({ operation: 'update', loading: false }));
//     }
//   };

//   const deleteTransactionFromServer = async (id: string) => {
//     let deletedTransaction: TransactionData | undefined;
    
//     try {
//       dispatch(setOperationLoading({ operation: 'delete', loading: true }));
//       dispatch(setError(null));

//       deletedTransaction = transactions.find(t => t._id === id);
//       if (deletedTransaction) {
//         dispatch(deleteTransaction(id));
//       }

//       await API.delete(`/transactions/${id}`);
//     } catch (err) {
//       console.error('Error deleting transaction:', err);
//       if (deletedTransaction) {
//         dispatch(addTransaction(deletedTransaction));
//       }
//       dispatch(setError('Failed to delete transaction. Please try again.'));
//       throw err;
//     } finally {
//       dispatch(setOperationLoading({ operation: 'delete', loading: false }));
//     }
//   };

//   return {
//     transactions,
//     loading,
//     error,
//     operationLoading,
//     addTransaction: addTransactionToServer,
//     updateTransaction: updateTransactionInServer,
//     deleteTransaction: deleteTransactionFromServer,
//     refreshTransactions: fetchTransactions
//   };
// };

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import { TransactionFormData } from '../utils/types';

interface TransactionsResponse {
  transactions: any[];
  success: boolean;
}

export const useTransactions = () => {
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions'], 
    queryFn: async () => {
      const response = await API.get<TransactionsResponse>('/transactions');
      return response.data.transactions;
    },
  });

  const addMutation = useMutation({
    mutationFn: (newTransaction: Partial<TransactionFormData>) => 
      API.post('/transactions', newTransaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "An error occurred while adding the transaction. Please try again.";
      console.error(msg, error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updatedData }: { id: string; updatedData: Partial<TransactionFormData> }) => 
      API.put(`/transactions/${id}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "An error occurred while updating the transaction. Please try again.";
      console.error(msg, error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => API.delete(`/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "An error occurred while deleting the transaction. Please try again.";
      console.error(msg, error);
      alert(msg);
    }
  });

  return {
    transactions,
    isLoading,
    error,
    addTransaction: addMutation.mutateAsync,
    isAdding: addMutation.isPending,

    updateTransaction: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteTransaction: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
