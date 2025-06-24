import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { DataGrid, GridColDef, GridRenderCellParams, GridAlignment } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { TransactionsTableProps, TransactionData } from '../utils/types';
import { ArrowRight as ArrowRightIcon } from '@mui/icons-material';
import AddTransactionModal from './AddTransactionModal';
import { useModal } from '../hooks/useModal';


const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions, handleDelete }) => {
    const navigate = useNavigate(); 
      const location = useLocation();

    const { isOpen, openModal, closeModal } = useModal();
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null);
    const isTransactionsPage = location.pathname === '/transactions';

    const handleOpenDialog = () => {
        setSelectedTransaction(null);
        openModal();
      };
  
    const onEdit = (transaction: TransactionData) => {
    //   handleEdit(transaction);
        setSelectedTransaction(transaction);
        openModal();
    };
  

    const columns: GridColDef[] = [
        { field: 'amount', headerName: 'Amount', flex: 1,  align: 'center', headerAlign: 'center'  },
        { field: 'category', headerName: 'Category', flex: 1,  align: 'center', headerAlign: 'center'  },
        { field: 'type', headerName: 'Type', flex: 1,  align: 'center', headerAlign: 'center' },
        { 
        field: 'date', 
        headerName: 'Date', 
        flex: 1,
        align: 'center', 
        headerAlign: 'center',
        valueFormatter: (params) => 
            params ? new Date(params).toLocaleDateString() : 'N/A'
        },
        { 
        field: 'description', 
        headerName: 'Description', 
        flex: 1 ,
        align: 'center', 
        headerAlign: 'center',
        valueGetter: (params: GridRenderCellParams) => params || "-", 
        },
        ...(isTransactionsPage && handleDelete ? [
            {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            align: 'center' as GridAlignment,
            headerAlign: 'center'  as GridAlignment,
            renderCell: (params: GridRenderCellParams) => (
                <Box>
                    <IconButton 
                        onClick={() => onEdit(params.row)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton 
                        color="secondary" 
                        onClick={() => handleDelete(params.row._id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
                )
            }
        ] 
        : []
    )
    ];

    const isEmpty = transactions.length === 0;
    return (
        <Box>
          {isEmpty ? (
            <>
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="h6" gutterBottom>No transactions yet.</Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                Add your first transaction to get started.
              </Typography>
            </Box>
            <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
            sx={{ backgroundColor: "#1a73e8", '&:hover': { backgroundColor: "#0059b3" } }}
          >
            Add Transaction
          </Button>
          </>
          ) : (
            <>
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ width: '100%' }}>
                <DataGrid
                  rows={transactions}
                  columns={columns}
                  getRowId={(row) => row._id || row.id}
                  initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
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
              </Box>
            </Box>

            <Box sx={{ display: 'flex', mt: 3, justifyContent: 'flex-start' }}>
            {isTransactionsPage ? (
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpenDialog}
                sx={{ backgroundColor: "#1a73e8", '&:hover': { backgroundColor: "#0059b3" } }}
            >
                Add Transaction
            </Button>
            ) : (
            !isEmpty && (
                <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'pointer',
                }} 
                onClick={() => navigate('/transactions')}
                >
                <Typography variant="h6">View all Transactions</Typography>
                <IconButton>
                    <ArrowRightIcon />
                </IconButton>
                </Box>
            )
            )}
            </Box>
            </>
          )}
    
       
    
            <AddTransactionModal
                open={isOpen}
                onClose={closeModal}
                selectedTransaction={selectedTransaction}
            />
        </Box>
      );

};

export default TransactionsTable;