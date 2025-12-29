import React from 'react';
import { Dialog, DialogContent } from '@mui/material';
import AddTransactionForm from './AddTransactionForm';
import { TransactionData } from '../utils/types';

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  selectedTransaction?: TransactionData | null;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  open,
  onClose,
  selectedTransaction = null,
}) => {
 
  // const handleSubmit = async (transactionData: any) => {
  //   try {
  //     if (selectedTransaction) {
  //       await updateTransaction({id: selectedTransaction?._id, updatedData: transactionData});
  //     } else {
  //       await addTransaction(transactionData);
  //     }
  //     onSuccess?.();
  //     onClose();
  //   } catch (error) {
      
  //   }
  // };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <AddTransactionForm
          // onSuccess={handleSubmit}
          handleClose={onClose}
          transaction={selectedTransaction}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionModal;
