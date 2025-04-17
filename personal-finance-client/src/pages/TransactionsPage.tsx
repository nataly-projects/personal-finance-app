import React, { useState } from "react";
import { Typography, Box, CircularProgress, Alert, Button, Dialog, DialogContent } from "@mui/material";
import { useTransactions } from '../hooks/useTransactions';
import AddTransactionForm from '../components/AddTransactionForm';
import TransactionsTable from '../components/TransactionsTable';

const TransactionsPage: React.FC = () => {
  const { transactions, loading, error, addTransaction } = useTransactions();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAddTransaction = async (transactionData: any) => {
    try {
      await addTransaction(transactionData);
      handleCloseAddDialog();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      // Add logic to open an edit dialog or navigate to an edit page
    } catch (error) {
      console.error("Error editing transaction:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Add logic to delete the transaction
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
            />
          </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TransactionsPage;
