import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../utils/types';

interface TasksTableProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const TasksTable: React.FC<TasksTableProps> = ({ tasks, onToggleComplete, onEdit, onDelete }) => {
    console.log('tasks: ', tasks);
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
            <IconButton onClick={() => onEdit(params.row._id)}>
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
    </Box>
  );
};

export default TasksTable;