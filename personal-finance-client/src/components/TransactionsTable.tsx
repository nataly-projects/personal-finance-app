import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { DataGrid, GridColDef, GridRenderCellParams, GridAlignment } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { TransactionsTableProps } from '../utils/types';
import { ArrowRight as ArrowRightIcon } from '@mui/icons-material';


const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions, handleOpenAddDialog, handleEdit, handleDelete }) => {
    const navigate = useNavigate(); 
    
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
        ...(handleOpenAddDialog && handleEdit && handleDelete ? [
            {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            align: 'center' as GridAlignment,
            headerAlign: 'center'  as GridAlignment,
            renderCell: (params: GridRenderCellParams) => (
                <Box>
                    <IconButton 
                        onClick={() => handleEdit(params.row)}
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
    
  return (
    <Box>
        <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ width: '100%'}}>
                <DataGrid
                rows={transactions}
                columns={columns}
                getRowId={(row) => row._id}
                initialState={{
                    pagination: {
                    paginationModel: { pageSize: 10, page: 0 }
                    },
                }}
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
        <Box
            sx={{
            display: 'flex', 
            mt: 3, 
            justifyContent: handleOpenAddDialog ? 'flex-start' : 'center', 
            }}
        >
            {handleOpenAddDialog ? (
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleOpenAddDialog}
                    sx={{
                        alignSelf: "flex-start",
                        backgroundColor: "#1a73e8",
                        '&:hover': { backgroundColor: "#0059b3" }
                    }}
                    >
                    Add Transaction
                </Button>
            )
            :
            (
                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        cursor: 'pointer', 
                    }} 
                    onClick={() => navigate('/transactions')}
                >
                    <Typography variant="h6" >View all Transactions</Typography>
                    <IconButton >
                        <ArrowRightIcon />
                    </IconButton>
                </Box>
            )}
        </Box>
    </Box>
    
  );
};

export default TransactionsTable;