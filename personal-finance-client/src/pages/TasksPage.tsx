import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog,  DialogContent } from '@mui/material';
import AddTaskForm from '../components/AddTaskForm';
import API from '../services/api';
import TasksTable from '../components/TasksTable';
import {Task} from '../utils/types';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
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

  const handleDelete = async (taskId: string) => {
    try {
        await API.delete(`/tasks/${taskId}`);
        
        window.location.reload();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
  };
  
  const handleEdit = async (taskId: string) => {
    await API.put(`/tasks/${taskId}`);
    console.log('Edit task:', taskId);
  };

  const handleToggleComplete = async (updatedTask: Task) => {
    const newStatus: 'pending' | 'completed' = updatedTask.status === 'completed' ? 'pending' : 'completed';
    const updatedTaskWithStatus: Task = { 
        ...updatedTask, 
        status: newStatus,
        completed: newStatus === 'completed',
        updatedAt: new Date()
    };
    
    setTasks(tasks.map(task =>
        task._id === updatedTask._id ? updatedTaskWithStatus : task
    ));
  
    try {
      const response = await API.put(`/tasks/${updatedTask._id}`, updatedTaskWithStatus);
    } catch (error) {
      console.error(error);
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
      <TasksTable
        tasks={tasks}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
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