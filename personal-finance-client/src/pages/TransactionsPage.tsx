import React, { useState } from "react";
import { Typography, Box, CircularProgress, Alert, Button, Dialog, DialogContent } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useTransactions } from '../hooks/useTransactions';
import AddTransactionForm from '../components/AddTransactionForm';
import AddIcon from '@mui/icons-material/Add';
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

  // const columns: GridColDef[] = [
  //   { field: 'amount', headerName: 'Amount', flex: 1,  align: 'center', headerAlign: 'center'  },
  //   { field: 'category', headerName: 'Category', flex: 1,  align: 'center', headerAlign: 'center'  },
  //   { field: 'type', headerName: 'Type', flex: 1,  align: 'center', headerAlign: 'center' },
  //   { 
  //     field: 'date', 
  //     headerName: 'Date', 
  //     flex: 1,
  //     align: 'center', 
  //     headerAlign: 'center',
  //     valueFormatter: (params: GridRenderCellParams) => 
  //       params ? new Date(params).toLocaleDateString() : 'N/A'
  //   },
  //   { 
  //     field: 'note', 
  //     headerName: 'Note', 
  //     flex: 1 ,
  //     align: 'center', 
  //     headerAlign: 'center',
  //     valueGetter: (params: GridRenderCellParams) => params || "-", 
  //   }
  // ];

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
      <TransactionsTable transactions={transactions} handleOpenAddDialog={handleOpenAddDialog} />

      {/* <Box sx={{ width: '100%'}}>
        <DataGrid
          rows={transactions}
          columns={columns}
          getRowId={(row) => row._id}
          pageSizeOptions={[5, 10, 20, 50]}
          disableRowSelectionOnClick
          pagination
          sx={{
            '& .MuiDataGrid-row': {
              '&.income': { backgroundColor: '#e0f2f1' },
              '&.expense': { backgroundColor: '#e37485' }
            }
          }}
          getRowClassName={(params) => params.row.type}
        />
      </Box> */}

      {/* <Button 
        sx={{mt: 2}}
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />}
        onClick={handleOpenAddDialog}
        >
        Add Transaction
      </Button> */}

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
