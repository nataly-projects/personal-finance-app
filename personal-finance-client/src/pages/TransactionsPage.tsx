import React, {useMemo, useState} from "react";
import { Typography, Box, CircularProgress, Alert } from "@mui/material";
import { useTransactions } from '../hooks/useTransactions';
import TransactionsTable from '../components/TransactionsTable';
import FilterSection from "../components/FilterSection";
import ExportToCSV from "../components/ExportToCSV";

const TransactionsPage: React.FC = () => {
  const { 
    transactions = [], 
    isLoading, 
    error, 
    deleteTransaction,
  } = useTransactions();

  const [filters, setFilters] = useState({ type: '', start: '', end: '', min: '' as string | number });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchType = !filters.type || t.type === filters.type;
      const minAmountValue = filters.min === '' ? 0 : Number(filters.min);
      const matchMin = t.amount >= minAmountValue;
      const transactionDate = new Date(t.date).setHours(0,0,0,0);
      const startLimit = filters.start ? new Date(filters.start).setHours(0,0,0,0) : null;
      const endLimit = filters.end ? new Date(filters.end).setHours(0,0,0,0) : null;

      const matchDate = (!startLimit || transactionDate >= startLimit) &&
                        (!endLimit || transactionDate <= endLimit);
      
      return matchType && matchMin && matchDate;
    });
  }, [transactions, filters]);

  const handleReset = () => setFilters({ type: '', start: '', end: '', min: '' });


  const handleDelete = (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this transaction?");
    if (!confirm) return;
    deleteTransaction(id);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Transactions
        </Typography>
      </Box>

      <ExportToCSV 
      data={filteredTransactions} 
      filename={`transactions_export_${new Date().toLocaleDateString()}`} 
      />

      <FilterSection 
        filterType={filters.type}
        handleTypeChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
        startDate={filters.start}
        handleStartDateChange={(e) => setFilters(prev => ({ ...prev, start: e.target.value }))}
        endDate={filters.end}
        handleEndDateChange={(e) => setFilters(prev => ({ ...prev, end: e.target.value }))}
        minAmount={filters.min}
        handleMinAmountChange={(e) => setFilters(prev => ({ ...prev, min: e.target.value }))}
        onReset={handleReset}
        isExpenseFilter={true} 
        selectOptions={{ income: 'income', expense: 'expense' }}
      />

      <TransactionsTable 
        transactions={filteredTransactions} 
        handleDelete={handleDelete} 
      />

    </Box>
  );
};

export default TransactionsPage;
