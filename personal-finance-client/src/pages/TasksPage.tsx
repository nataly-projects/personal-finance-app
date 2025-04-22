import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog,  DialogContent } from '@mui/material';
import TaskList from '../components/TaskList';
import AddTaskForm from '../components/AddTaskForm';
import API from '../services/api';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await API.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDialogOpen = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);

  const handleAddTask = async (task: any) => {
    try {
      await API.post('/tasks/', task);
      fetchTasks();
      handleDialogClose();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        Tasks
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDialogOpen}
        sx={{ mb: 3 }}
      >
        Add New Task
      </Button>
      <TaskList propTasks={tasks} />
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogContent>
          <AddTaskForm
            open={open}
            onSave={handleAddTask}
            onClose={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TasksPage;