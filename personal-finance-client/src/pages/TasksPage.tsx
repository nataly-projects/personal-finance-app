import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Box, CircularProgress, Alert } from '@mui/material';
import { useTasks } from '../hooks/useTasks';
import AddTaskModal from '../components/AddTaskModal';
import TasksTable from '../components/TasksTable';
import { useModal } from '../hooks/useModal';
import { Task } from '../utils/types';


const TasksPage: React.FC = () => {
  const { tasks, loading, error, updateTask, deleteTask } = useTasks();
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleAddNew = () => {
    setSelectedTask(null);
    openModal();
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    openModal();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
      } catch (err) {
      }
    }
  };


  const handleToggleComplete = async (task: Task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await updateTask({id: task._id, data:{
      ...task,
      completed: newStatus === 'completed',
      status: newStatus,
      updatedAt: new Date()
      }});
    } catch (err) {
    }
  };

    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      );
  }
  
  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
        Tasks
      </Typography>
        <Button variant="contained" color="primary" onClick={openModal}>
          Add New Task
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error.toString()}</Alert>}

      <TasksTable
        tasks={tasks}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onToggleComplete={handleToggleComplete}
      />

      <AddTaskModal
        open={isOpen}
        onClose={closeModal}
        selectedTask={selectedTask}
      />
    </Container>
  );
};

export default TasksPage;