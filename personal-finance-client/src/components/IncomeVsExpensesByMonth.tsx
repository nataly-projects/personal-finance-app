import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ExpensesProps } from "../utils/types";

type MonthlyData = Record<
  string,
  { month: string; income: number; expense: number }
>;

const IncomeVsExpensesByMonth: React.FC<ExpensesProps> = ({ data }) => {
  const monthlyData: MonthlyData = data.reduce((acc, txn) => {
    const date = new Date(txn.date);
    const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (!acc[month]){
      acc[month] = { month, income: 0, expense: 0 };
    } 
    if (txn.type === 'income' || txn.type === 'expense') {
      acc[month][txn.type] += txn.amount;
    }
    return acc;
  }, {} as MonthlyData);

  const chartData = Object.values(monthlyData);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#00C49F" name="Income" />
        <Line type="monotone" dataKey="expense" stroke="#FF8042" name="Expense" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default IncomeVsExpensesByMonth;
