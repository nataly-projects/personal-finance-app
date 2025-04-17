import React from 'react';
import { Box, Typography, Checkbox, Chip } from '@mui/material';
import { TaskItemProps } from '../utils/types';

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete }) => {
  const backgroundColor = task.status === 'completed' ? '#f5f5f5' : 'white';
  const textDecoration = task.status === 'completed' ? 'line-through' : 'none';

  const getDaysOverdue = (dueDate: Date) => {
    const today = new Date();
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOverdue = task.dueDate && getDaysOverdue(task.dueDate) > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        backgroundColor,
        borderRadius: '4px',
        marginBottom: '8px',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Checkbox
        checked={task.status === 'completed'}
        onChange={() => onToggleComplete(task)}
        sx={{
          marginRight: '15px',
          color: task.status === 'completed' ? '#4caf50' : '#1976d2',
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
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textDecoration }}
        >
          {task.description}
        </Typography>
        {task.dueDate && (
          <Typography
            variant="caption"
            color={isOverdue ? 'error.main' : 'text.secondary'}
            sx={{ display: 'block', mt: 0.5 }}
          >
            Due: {task.dueDate.toLocaleDateString()}
            {isOverdue && ` (${getDaysOverdue(task.dueDate)} days overdue)`}
          </Typography>
        )}
      </Box>
      <Chip
        label={task.status}
        size="small"
        color={
          task.status === 'pending' ? 'secondary' :
          task.status === 'completed' ? 'success' :
          'primary'
        }
        sx={{ marginLeft: '10px' }}
      />
    </Box>
  );
};

export default TaskItem;