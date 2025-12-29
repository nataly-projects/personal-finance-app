import React from "react";
import { Box, Typography, Dialog, DialogContent, Button } from "@mui/material";
import Dashboard from "./Dashboard";
import AddTransactionForm from "../components/AddTransactionForm";
import { useModal } from "../hooks/useModal";
import { useQueryClient } from '@tanstack/react-query';
import AddIcon from '@mui/icons-material/Add';

const HomePage: React.FC = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    closeModal();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Welcome Back
        </Typography>
        <Button variant="contained" onClick={openModal} startIcon={<AddIcon />}>
          Add Transaction
        </Button>
      </Box>

      <Dashboard />

      <Dialog open={isOpen} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogContent>
          <AddTransactionForm onSuccess={handleSuccess} handleClose={closeModal} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default HomePage;