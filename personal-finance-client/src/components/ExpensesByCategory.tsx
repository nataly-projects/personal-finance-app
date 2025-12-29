import React from "react";
import { useTheme } from "@mui/material/styles";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ExpensesProps } from "../utils/types";

const ExpensesByCategory: React.FC<ExpensesProps> = ({ data }) => {
  const theme = useTheme();

  const COLORS = theme.customColors.chartColors;

  const categoryData = data.reduce<Record<string, number>>((acc, txn) => {
    if (txn.type === "expense") {
      const category = txn.category;
      acc[category] = (acc[category] || 0) + txn.amount;
    }
    return acc;
  }, {});


  const chartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          // cx="50%"
          // cy="50%"
          innerRadius={60}
          outerRadius={120}
          paddingAngle={5}
          // fill="#8884d8"
          // label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />          
          ))}
        </Pie>

        <Tooltip 
          contentStyle={{ 
            backgroundColor: theme.palette.background.paper, 
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}` 
          }} 
        />

      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExpensesByCategory;
