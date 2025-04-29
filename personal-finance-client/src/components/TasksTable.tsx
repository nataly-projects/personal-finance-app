import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Box, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../utils/types';

interface TasksTableProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  handleOpenAddDialog?: () => void;
}

const TasksTable: React.FC<TasksTableProps> = ({ tasks, onToggleComplete, onEdit, onDelete, handleOpenAddDialog }) => {
    
  const columns: GridColDef[] = [
    {
        field: 'completed',
        headerName: 'Completed',
        flex: 1,
        headerAlign: 'center',
        align: 'center', 
        renderCell: (params) => (
            <IconButton onClick={() => onToggleComplete(params.row)}>
            {params.row.completed ? <CheckCircleIcon color="success" /> : <RadioButtonUncheckedIcon />}
            </IconButton>
        ),
    },
    { field: 'title', headerName: 'Title', flex: 1,
        headerAlign: 'center',
        align: 'center',  },
    { field: 'description', headerName: 'Description', flex: 2,
        headerAlign: 'center',
        align: 'center',  },
    {
        field: 'dueDate',
        headerName: 'Due Date',
        flex: 1,
        headerAlign: 'center',
        align: 'center', 
        valueFormatter: (params) => 
            params ? new Date(params).toLocaleDateString() : 'N/A'
    },
    {
        field: 'updatedAt',
        headerName: 'Updated Date',
        flex: 1,
        headerAlign: 'center',
        align: 'center', 
        valueFormatter: (params) => 
          params ? new Date(params).toLocaleDateString() : '-'
    },
    {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,
        headerAlign: 'center',
        align: 'center', 
        renderCell: (params) => (
            <Box>
            <IconButton onClick={() => onEdit(params.row)}>
                <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(params.row._id)}>
                <DeleteIcon />
            </IconButton>
            </Box>
        ),
    },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={tasks}
        columns={columns}
        getRowId={(row) => row._id}
        initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
        }}
        pageSizeOptions={[5, 10, 20, 50]}
        disableRowSelectionOnClick
      />
      <Box
        sx={{
        display: 'flex', 
        mt: 3, 
        justifyContent:'flex-start'
        }}
      >
       {handleOpenAddDialog && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddDialog}
            sx={{
              alignSelf: 'flex-start',
              backgroundColor: '#1a73e8',
              '&:hover': { backgroundColor: '#0059b3' },
            }}
          >
            Add Task
          </Button>
        )}
      </Box>

    </Box>
  );
};

export default TasksTable;