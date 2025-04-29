import React, { useState } from "react";
import { Typography, Box, CircularProgress, Alert, Dialog, DialogContent } from "@mui/material";
import { useTransactions } from '../hooks/useTransactions';
import AddTransactionForm from '../components/AddTransactionForm';
import TransactionsTable from '../components/TransactionsTable';
import { TransactionData } from '../utils/types';

const TransactionsPage: React.FC = () => {
  const { transactions, loading, error, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null);

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setSelectedTransaction(null);
  };

  const handleAddTransaction = async (transactionData: any) => {
    try {
      if (selectedTransaction) {
        console.log("Updating transaction:", selectedTransaction._id);
        await updateTransaction(selectedTransaction._id, transactionData); 
      } else {
        await addTransaction(transactionData);
      }
      handleCloseAddDialog();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleEdit = async (transaction: TransactionData) => {
    setSelectedTransaction(transaction);
    setOpenAddDialog(true);
  };

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
      handleOpenAddDialog={handleOpenAddDialog} 
      handleEdit={handleEdit} 
      handleDelete={handleDelete} 
      />

      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogContent>
          <AddTransactionForm 
            onSuccess={handleAddTransaction} 
            handleClose={handleCloseAddDialog}
            transaction={selectedTransaction}
            />
          </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TransactionsPage;
