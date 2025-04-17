import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {ExpensesProps} from "../utils/types.js";

const ExpensesByYear: React.FC<ExpensesProps> = ({ data }) => {
  // סיכום נתונים לפי שנה
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
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="expense" fill="#ff8042" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExpensesByYear;
