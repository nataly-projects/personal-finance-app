import { SelectChangeEvent } from "@mui/material";

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: Date | null;
  updatedAt?: Date | null;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  expensesByCategory: { [key: string]: number };
  recentTransactions: TransactionData[];
  tasks: Task[];
}

export interface TransactionData {
  _id: string;
  amount: number;
  category: string;
  type: "income" | "expense" | undefined;
  date: Date;
  description: string;
}

export interface TransactionsTableProps {
  transactions: TransactionData[];
  handleOpenAddDialog?: () => void;
  handleEdit?: (transaction: TransactionData) => void; 
  handleDelete?: (id: string) => void;
}

// interface Transaction {
//   _id: string;
//   amount: number;
//   category: string;
//   date: string;
//   type: 'income' | 'expense';
//   description: string;
// }



export interface ExpensesProps {
  data: TransactionData[];
}

export interface ExpensesByMonthInYearProps {
  data: TransactionData[];
  year: number;
}
  
export interface AddTransactionFormProps {
  onSuccess?: (data: any) => void;
  handleClose?: () => void;
  transaction?: TransactionData | null;
}

export interface Category {
  _id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterSectionProps {
  filterType: string;
  handleTypeChange: (event: SelectChangeEvent) => void;  startDate: string;
  handleStartDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  endDate: string;
  handleEndDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  minAmount?: number;
  handleMinAmountChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectOptions: Record<string, string>;
  isExpenseFilter: boolean;
}

// export interface Transaction {
//   _id: string;
//   userId: string;
//   amount: number;
//   type: 'income' | 'expense';
//   category: string;
//   date: Date;
//   note?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }


export type TaskStatus = 'pending' | 'completed';

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description: string;
  dueDate?: Date | null;
  status: 'pending' | 'completed';
  completed: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}



export interface TaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
}

export interface TaskListProps {
  propTasks: Task[];
  // token: string;
  // userId: string;
}

export interface TransactionFormData {
  amount: number;
  type: 'income' | 'expense' | null;
  category: string;
  date: Date | null;
  description: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate?: Date | null;
  status: 'pending' | 'completed';
  completed: boolean;
  userId: string;
}

export interface AddTaskFormProps {
  onClose: () => void;
  onSave: (data: TaskFormData) => void;
  task?: Task | null;
}

// export interface FilterSectionProps {

//   filterType: string;

//   handleTypeChange: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;

//   startDate: string;

//   handleStartDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

//   endDate: string;

//   handleEndDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

//   handleMinAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

//   minAmount: string;

//   selectOptions: { [key: string]: string };

//   isExpenseFilter: boolean;

// }
  
  