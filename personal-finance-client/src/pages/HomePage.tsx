import React, { useEffect } from "react";
import { Box, Typography, Dialog, DialogContent } from "@mui/material";
import Dashboard from "./Dashboard";
import AddTransactionForm from "../components/AddTransactionForm";
import API from "../services/api";
import { useModal } from "../hooks/useModal";

const HomePage: React.FC = () => {
  const [transactions, setTransactions] = React.useState([]);
  const { isOpen, openModal, closeModal } = useModal();

  const fetchTransactions = async () => {
    try {
      const response = await API.get("/transactions");
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };
  
  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        Personal Finance Dashboard
      </Typography>
      <Dashboard />
      <Dialog open={isOpen} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogContent>
          <AddTransactionForm
            onSuccess={() => {
              fetchTransactions(); 
              closeModal(); 
            }}
            handleClose={closeModal}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default HomePage;
