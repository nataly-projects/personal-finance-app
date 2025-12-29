import React from 'react';
import { Box, Typography, Checkbox, Chip, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { TaskItemProps } from '../utils/types';

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete }) => {
  const theme = useTheme();
  const isCompleted = task.status === 'completed';

  const backgroundColor = isCompleted 
    ? theme.customColors.taskCompletedBg 
    : theme.customColors.taskPendingBg;

  // const backgroundColor = task.status === 'completed' ? '#f5f5f5' : 'white';
  const textDecoration = task.status === 'completed' ? 'line-through' : 'none';

  const getDaysOverdue = (dueDate: Date) => {
    const date = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOverdue = task.dueDate && !isCompleted && getDaysOverdue(task.dueDate) > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        backgroundColor,
        borderRadius: '4px',
        marginBottom: '8px',
        border: isOverdue ? '1px solid #d32f2f' : '1px solid #e0e0e0',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Checkbox
        checked={isCompleted}
        onChange={() => onToggleComplete(task._id, task.status)}
        sx={{
          marginRight: '15px',
          color: isCompleted ? '#4caf50' : '#1976d2',
          '&.Mui-checked': {
            color: '#4caf50',
          },
        }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            textDecoration,
            fontWeight: 'medium',
            color: isOverdue ? 'error.main' : 'text.primary',
          }}
        >
          {task.title}
        </Typography>

        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ textDecoration }}>
            {task.description}
          </Typography>
        )}

        {task.dueDate && (
          <Typography
            variant="caption"
            color={isOverdue ? 'error.main' : 'text.secondary'}
            sx={{ display: 'block', mt: 0.5 }}
          >
            Due: {new Date(task.dueDate).toLocaleDateString()}
            {isOverdue && ` (${getDaysOverdue(task.dueDate)} days overdue)`}
          </Typography>
        )}
      </Box>

      <Chip
        label={task.status}
        size="small"
        color= {isCompleted ? 'success' : isOverdue ? 'error' : 'secondary' }
        sx={{ marginLeft: '10px', marginRight: '10px' }}
      />

      <IconButton onClick={() => onDelete(task._id)} size="small" color="default">
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default TaskItem;