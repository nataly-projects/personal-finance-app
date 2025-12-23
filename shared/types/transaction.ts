export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  category: string;
  userId: string;
  type: 'income' | 'expense';
  createdAt: Date;
  updatedAt: Date | null;
}

export interface AddTransactionRequest {
  amount: number;
  description: string;
  date: Date;
  category: string;
  categoryId?: string;
  type: 'income' | 'expense';
}

export interface AddTransactionResponse {
  success: boolean;
  transaction?: Transaction;
  error?: string;
}

export interface GetTransactionsResponse {
  success: boolean;
  transactions?: Transaction[];
  error?: string;
}

export interface UpdateTransactionRequest {
  amount?: number;
  description?: string;
  date?: Date;
  categoryId?: string;
  type?: 'income' | 'expense';
}

export interface UpdateTransactionResponse {
  success: boolean;
  transaction?: Transaction;
  error?: string;
}

export interface DeleteTransactionResponse {
  success: boolean;
  error?: string;
} 