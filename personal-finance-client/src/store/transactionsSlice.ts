import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TransactionData } from '../utils/types';

interface TransactionsState {
  items: TransactionData[];
  loading: boolean;
  error: string | null;
  operationLoading: {
    add: boolean;
    update: boolean;
    delete: boolean;
  };
}

const initialState: TransactionsState = {
  items: [],
  loading: false,
  error: null,
  operationLoading: {
    add: false,
    update: false,
    delete: false
  }
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<TransactionData[]>) => {
      state.items = action.payload;
    },
    addTransaction: (state, action: PayloadAction<TransactionData>) => {
      state.items.push(action.payload);
    },
    updateTransaction: (state, action: PayloadAction<TransactionData>) => {
      const index = state.items.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t._id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setOperationLoading: (state, action: PayloadAction<{ operation: 'add' | 'update' | 'delete', loading: boolean }>) => {
      state.operationLoading[action.payload.operation] = action.payload.loading;
    }
  },
});

export const { 
  setTransactions, 
  addTransaction, 
  updateTransaction, 
  deleteTransaction,
  setLoading,
  setError,
  setOperationLoading
} = transactionsSlice.actions;

export default transactionsSlice.reducer;