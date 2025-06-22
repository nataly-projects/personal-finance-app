import React, { useState } from 'react';
import { Dialog, DialogContent, CircularProgress } from '@mui/material';
import { useTransactions } from '../hooks/useTransactions';
import AddTransactionForm from './AddTransactionForm';
import { TransactionData } from '../utils/types';

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  selectedTransaction?: TransactionData | null;
  onSuccess?: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  open,
  onClose,
  selectedTransaction = null,
  onSuccess,
}) => {
  const { addTransaction, updateTransaction } = useTransactions();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (transactionData: any) => {
    setLoading(true);
    try {
      if (selectedTransaction) {
        await updateTransaction(selectedTransaction._id, transactionData);
      } else {
        await addTransaction(transactionData);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error submitting transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <AddTransactionForm
            onSuccess={handleSubmit}
            handleClose={onClose}
            transaction={selectedTransaction}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionModal;
