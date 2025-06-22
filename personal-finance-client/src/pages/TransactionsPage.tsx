import React, { useEffect } from "react";
import { Typography, Box, CircularProgress, Alert, Dialog, DialogContent } from "@mui/material";
import { useDispatch } from "react-redux";
import { useTransactions } from '../hooks/useTransactions';
import TransactionsTable from '../components/TransactionsTable';

const TransactionsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    transactions, 
    loading, 
    error, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    refreshTransactions 
  } = useTransactions();

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

 
  const handleDelete = async (id: string) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this transaction?");
      if (!confirm) return;
      await deleteTransaction(id);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
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
      <TransactionsTable 
        transactions={transactions} 
        handleDelete={handleDelete} 
      />

    </Box>
  );
};

export default TransactionsPage;
