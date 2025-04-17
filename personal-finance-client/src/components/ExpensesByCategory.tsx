import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ExpensesProps } from "../utils/types";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384", "#36A2EB"];

const ExpensesByCategory: React.FC<ExpensesProps> = ({ data }) => {
  // עיבוד נתונים: חישוב סך כל ההוצאות לפי קטגוריה
  const categoryData = data.reduce<Record<string, number>>((acc, txn) => {
    if (txn.type === "expense") {
      const category = txn.category;
      acc[category] = (acc[category] || 0) + txn.amount;
    }
    return acc;
  }, {});

  // הכנת נתונים לגרף
  const chartData = Object.keys(categoryData).map((category) => ({
    name: category,
    value: categoryData[category],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExpensesByCategory;
