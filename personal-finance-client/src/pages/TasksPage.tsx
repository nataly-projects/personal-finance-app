import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog,  DialogContent, CircularProgress, Alert } from '@mui/material';
import AddTaskForm from '../components/AddTaskForm';
import TasksTable from '../components/TasksTable';
import {Task} from '../utils/types';
import {useTasks} from '../hooks/useTasks';

const TasksPage: React.FC = () => {
  const { tasks, loading, error, addTask, updateTask, deleteTask } = useTasks();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  }
  const handleAddTask = async (task: any) => {
    try {
      if(selectedTask) {
        console.log("Updating task:", selectedTask._id);
        await updateTask(selectedTask._id, task);
      }
      else {
        await addTask(task);
      }
      handleDialogClose();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this task?");
      if (!confirm) return;
      await deleteTask(taskId);
      window.alert("Task deleted successfully!");
      window.location.reload();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
  };
  
  const handleEdit = async (task: Task) => {
    setSelectedTask(task);
    setOpenDialog(true);
   
  };

  const handleToggleComplete = async (task: Task) => {
    const updatedTask = {
      ...task,
      completed: !task.completed,
      status: task.completed ? 'pending' : 'completed',
      updatedAt: new Date()
    };
   
    try {
      await updateTask(task._id, updatedTask);
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

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
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        Tasks
      </Typography>

      <TasksTable
        tasks={tasks}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEdit}
        onDelete={handleDelete}
        handleOpenAddDialog={handleDialogOpen}
      />
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <AddTaskForm
            onSave={handleAddTask}
            onClose={handleDialogClose}
            task={selectedTask}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TasksPage;