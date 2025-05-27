import React, { useState } from 'react';
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box } from '@mui/material';
import { useTasks } from '../hooks/useTasks';
import { useModal } from '../hooks/useModal';
import TasksTable from '../components/TasksTable';
import { Task } from '../utils/types';

type TaskStatus = 'pending' | 'completed';

const TasksPage: React.FC = () => {
  const { tasks, loading, error, addTask, updateTask, deleteTask } = useTasks();
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending' as TaskStatus,
  });

  const handleClose = () => {
    closeModal();
    setSelectedTask(null);
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      status: 'pending',
    });
  };

  const handleAddTask = async () => {
    try {
      const newTask = {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        status: formData.status,
        completed: false,
        userId: '', 
        createdAt: new Date(),
        updatedAt: null,
      };

      if (selectedTask) {
        await updateTask(selectedTask._id, newTask);
      } else {
        await addTask(newTask);
      }

      handleClose();
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };
  
  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
      status: task.status as TaskStatus,
    });
    openModal();
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await updateTask(task._id, {
      ...task,
      completed: !task.completed,
        status: !task.completed ? 'completed' : 'pending' as const,
      updatedAt: new Date()
      });
    } catch (err) {
      console.error('Error toggling task completion:', err);
    }
  };

    if (loading) {
    return <Typography>Loading...</Typography>;
    }
  
    if (error) {
    return <Typography color="error">{error}</Typography>;
    }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
        Tasks
      </Typography>
        <Button variant="contained" color="primary" onClick={openModal}>
          Add Task
        </Button>
      </Box>

      <TasksTable
        tasks={tasks}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onToggleComplete={handleToggleComplete}
      />

      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>{selectedTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Status"
            select
            fullWidth
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
            SelectProps={{ native: true }}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddTask} color="primary">
            {selectedTask ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TasksPage;