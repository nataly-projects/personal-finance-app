import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {ExpensesByMonthInYearProps} from "../utils/types";

const ExpensesByMonthInYear: React.FC<ExpensesByMonthInYearProps> = ({ data, year }) => {
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
      <AreaChart data={chartData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="expense" stroke="#ff8042" fill="#ff8042" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ExpensesByMonthInYear;
