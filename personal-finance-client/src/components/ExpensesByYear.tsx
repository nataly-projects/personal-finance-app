import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "@mui/material/styles";
import {ExpensesProps} from "../utils/types.js";

const ExpensesByYear: React.FC<ExpensesProps> = ({ data }) => {
  const theme = useTheme();

  const yearlyExpenses = data.reduce<Record<number, number>>((acc, txn) => {
    if (txn.type === "expense") {
      const year = new Date(txn.date).getFullYear();
      acc[year] = (acc[year] || 0) + txn.amount;
    }
    return acc;
  }, {});

  const chartData = Object.keys(yearlyExpenses).map((year) => ({
    year,
    expense: yearlyExpenses[parseInt(year)],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="year" stroke={theme.palette.text.secondary}/>
        <YAxis stroke={theme.palette.text.secondary} />
        <Tooltip 
          contentStyle={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }} 
        />
        <Bar 
          dataKey="expense" 
          fill={theme.palette.error.main} 
          radius={[4, 4, 0, 0]} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExpensesByYear;
