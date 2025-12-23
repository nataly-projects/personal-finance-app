import { Transaction } from '../models/Transaction';
import { Task } from '../models/Task';

export const getDashboardData = async (userId: string) => {
  const transactions = await Transaction.find({ userId });
  
  const openTasks = await Task.find({ 
    userId, completed: false })
    .sort({ dueDate: 1 })
    .limit(5); //TODO - get the limit number from the client (in the request)

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const expensesByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      const category = t.category;
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    expensesByCategory,
    recentTransactions: transactions.slice(-5).reverse(),
    tasks: openTasks
  };
};