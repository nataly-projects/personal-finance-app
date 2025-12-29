import React from "react";
import { useTheme } from "@mui/material/styles";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { ExpensesProps } from "../utils/types";

type MonthlyData = Record<
  string,
  { month: string; income: number; expense: number }
>;

const IncomeVsExpensesByMonth: React.FC<ExpensesProps> = ({ data }) => {
  const theme = useTheme();

  const monthlyData: MonthlyData = data.reduce((acc, txn) => {
    const date = new Date(txn.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[monthKey]){
      acc[monthKey] = { month: monthKey, income: 0, expense: 0 };
    } 
    if (txn.type === 'income' || txn.type === 'expense') {
      acc[monthKey][txn.type] += txn.amount;
    }
    return acc;
  }, {} as MonthlyData);

  const chartData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>

        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />

        <XAxis 
          dataKey="month" 
          stroke={theme.palette.text.secondary} 
          fontSize={12}
          tickFormatter={(value) => {
            const [year, month] = value.split('-');
            return `${month}/${year.slice(2)}`;
          }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke={theme.palette.text.secondary} 
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: theme.palette.background.paper, 
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '8px',
            color: theme.palette.text.primary 
          }} 
        />
        <Legend verticalAlign="top" height={36}/>
        <Line 
          type="monotone" 
          dataKey="income" 
          stroke={theme.palette.success.main} 
          strokeWidth={3} 
          dot={{ r: 4, fill: theme.palette.success.main }} 
          activeDot={{ r: 6 }}
          name="Income" 
        />        
        <Line 
          type="monotone" 
          dataKey="expense" 
          stroke={theme.palette.error.main} 
          strokeWidth={3} 
          dot={{ r: 4, fill: theme.palette.error.main }} 
          activeDot={{ r: 6 }}
          name="Expense" 
        />      </LineChart>
    </ResponsiveContainer>
  );
};

export default IncomeVsExpensesByMonth;
