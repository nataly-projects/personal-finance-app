import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "@mui/material/styles";
import {ExpensesByMonthInYearProps} from "../utils/types";

const ExpensesByMonthInYear: React.FC<ExpensesByMonthInYearProps> = ({ data, year }) => {
  const theme = useTheme();
  const monthlyExpenses = Array(12).fill(0);

  data.forEach((txn) => {
    const date = new Date(txn.date);
    if (txn.type === "expense" && date.getFullYear() === year) {
      monthlyExpenses[date.getMonth()] += txn.amount;
    }
  });

  const chartData = monthlyExpenses.map((expense, index) => ({
    month: new Date(0, index).toLocaleString("default", { month: "long" }),
    expense,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={theme.palette.error.main} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={theme.palette.error.main} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="month" stroke={theme.palette.text.secondary} fontSize={10} />
        <YAxis stroke={theme.palette.text.secondary} fontSize={10} />
        <Tooltip 
          contentStyle={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}
        />
        <Area 
          type="monotone" 
          dataKey="expense" 
          stroke={theme.palette.error.main} 
          fillOpacity={1} 
          fill="url(#colorExpense)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ExpensesByMonthInYear;
