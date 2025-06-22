import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import TaskList from './TaskList';
import { Task } from '../utils/types';

const TaskSection: React.FC<{ tasks: Task[] }> = ({ tasks }) => (
  <Grid item xs={12}>
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Tasks</Typography>
      {tasks.length > 0 ? <TaskList propTasks={tasks} /> : <Typography>No open tasks</Typography>}
    </Paper>
  </Grid>
);

export default TaskSection;