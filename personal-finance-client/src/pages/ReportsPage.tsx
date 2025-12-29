import React, { useState, useMemo } from "react";
import { Typography, Box, Alert, FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid, 
  Paper,
  CircularProgress } from "@mui/material";
import ExpensesByYear from "../components/ExpensesByYear";
import IncomeVsExpensesByMonth from "../components/IncomeVsExpensesByMonth";
import ExpensesByMonthInYear from "../components/ExpensesByMonthInYear";
import ExpensesByCategory from "../components/ExpensesByCategory";
import { useTransactions } from "../hooks/useTransactions";
import ExportToCSV from "../components/ExportToCSV";

const ReportsPage: React.FC = () => {
  const { transactions, isLoading, error } = useTransactions();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const availableYears = useMemo(() => {
    if (!transactions.length) return [new Date().getFullYear()];
    
    const years = transactions.map(t => new Date(t.date).getFullYear());
    const uniqueYears = Array.from(new Set(years)).sort((a, b) => b - a); 
    return uniqueYears;
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => new Date(t.date).getFullYear() === selectedYear);
  }, [transactions, selectedYear]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Error loading data</Alert>
      </Box>
    );
  }



  return (
    <Box sx={{ p: 3 }}>
     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Reports and Analysis
        </Typography>

        <ExportToCSV 
          data={filteredTransactions} 
          filename={`Financial_Report_${selectedYear}`} 
        />

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="year-select-label">Select Year</InputLabel>
          <Select
            labelId="year-select-label"
            value={selectedYear}
            label="Select Year"
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {availableYears.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Expenses by Category ({selectedYear})</Typography>
            <ExpensesByCategory data={filteredTransactions} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>General Expenses by Year</Typography>
            <ExpensesByYear data={transactions} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Monthly Cash Flow ({selectedYear})</Typography>
            <IncomeVsExpensesByMonth data={filteredTransactions} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Monthly Expense Breakdown ({selectedYear})</Typography>
            <ExpensesByMonthInYear data={transactions} year={selectedYear} />
          </Paper>
        </Grid>
      </Grid>

      {/* <Typography variant="h6" sx={{ mb: 1 }}>
        Expenses by Category
      </Typography>
      <ExpensesByCategory data={transactions} /> */}

      {/* <Typography variant="h6" sx={{ mb: 1 }}>
        Expenses by Year
      </Typography>
      <ExpensesByYear data={transactions} /> */}

      {/* <Typography variant="h6" sx={{ mb: 1 }}>
        Income vs Expenses by Month
      </Typography>
      <IncomeVsExpensesByMonth data={transactions} /> */}

      {/* <Typography variant="h6" sx={{ mb: 1 }}>
        Expenses by Month in {year}
      </Typography>
      <ExpensesByMonthInYear data={transactions} year={year} /> */}
    </Box>
  );
};

export default ReportsPage;

