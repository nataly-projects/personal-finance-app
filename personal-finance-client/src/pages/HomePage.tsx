import React, {useState, useEffect} from "react";
import { Box, Typography, Dialog, DialogContent } from "@mui/material";
import Dashboard from "./Dashboard";
import AddTransactionForm from "../components/AddTransactionForm";
import API from "../services/api";

const HomePage: React.FC = () => {

  const [transactions, setTransactions] = useState([]);
  const [open, setOpen] = useState(false);

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

  const handleDialogClose = () => setOpen(false);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        Personal Finance Dashboard
      </Typography>
      <Dashboard />
        <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
          <DialogContent>
            <AddTransactionForm
              onSuccess={() => {
                fetchTransactions(); 
                handleDialogClose(); 
              }}
              handleClose={handleDialogClose}
            />
          </DialogContent>
      </Dialog>
    </Box>
  );
};

export default HomePage;
