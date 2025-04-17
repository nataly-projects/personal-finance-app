import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import API from "../services/api";
import ExpensesByYear from "../components/ExpensesByYear";
import IncomeVsExpensesByMonth from "../components/IncomeVsExpensesByMonth";
import ExpensesByMonthInYear from "../components/ExpensesByMonthInYear";
import ExpensesByCategory from "../components/ExpensesByCategory";
import { TransactionData } from "../utils/types";

const ReportsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await API.get("/transactions");
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        Reports and Analysis
      </Typography>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Expenses by Category
      </Typography>
      <ExpensesByCategory data={transactions} />

      <Typography variant="h6" sx={{ mb: 1 }}>
        Expenses by Year
      </Typography>
      <ExpensesByYear data={transactions} />

      <Typography variant="h6" sx={{ mb: 1 }}>
        Income vs Expenses by Month
      </Typography>
      <IncomeVsExpensesByMonth data={transactions} />

      <Typography variant="h6" sx={{ mb: 1 }}>
        Expenses by Month in {year}
      </Typography>
      <ExpensesByMonthInYear data={transactions} year={year} />
    </Box>
  );
};

export default ReportsPage;

