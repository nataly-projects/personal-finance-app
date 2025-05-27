import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { IconButton, Typography, Box, Dialog, DialogContent } from '@mui/material';
import { Add as AddIcon, ArrowRight as ArrowRightIcon } from '@mui/icons-material';
import { TaskListProps, Task, TaskFormData } from '../utils/types';
import AddTaskForm from './AddTaskForm';
import { List, ListItem, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useTasks } from '../hooks/useTasks';
import { useModal } from '../hooks/useModal';

const TaskList: React.FC<TaskListProps> = ({ propTasks }) => {
    const { tasks, addTask, updateTask } = useTasks();
    const navigate = useNavigate();
    const { isOpen, openModal, closeModal } = useModal();

    const handleAddTask = async (newTask: TaskFormData) => {
        const taskToSave: Task = { 
            ...newTask, 
            _id: "", 
            userId: "", 
            status: newTask.status || "pending",
            completed: newTask.status === 'completed',
            createdAt: new Date(),
            updatedAt: null
        };
        try {
            await addTask(taskToSave);
            closeModal();
        } catch (error) {
            console.error(error);
        }
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

    const navigateToAllTasksPage = () => {
        navigate('/tasks');
    };

    return (
        <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', backgroundColor: '#fff',
            justifyContent: 'space-between', flex: '1' }}>
                        
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="h6">Open Tasks</Typography>
                <IconButton onClick={openModal} color="primary">
                    <AddIcon />
                </IconButton>
            </Box>

            <List>
                {tasks.length === 0 ? (
                    <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                        No tasks found
                    </Typography>
                ) : (
                    tasks.map((task) => (
                        <ListItem key={task._id} divider>
                            <IconButton
                                sx={{ marginRight: 2 }}
                                edge="end"
                                aria-label="toggle complete"
                                onClick={() => handleToggleComplete(task)}
                            >
                                {task.completed ? <CheckCircleIcon color="success" /> : <RadioButtonUncheckedIcon />}
                            </IconButton>
                            <ListItemText
                                primary={task.title}
                                secondary={
                                    <>
                                        <Typography component="span" variant="body2" color="text.primary">
                                            {task.description}
                                        </Typography>
                                        {task.dueDate && (
                                            <Typography component="span" variant="body2" color="text.secondary">
                                                {' - Due: '}
                                                {new Date(task.dueDate).toLocaleDateString()}
                                            </Typography>
                                        )}
                                    </>
                                }
                            /> 
                        </ListItem>
                    ))
                )}
            </List>

            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'pointer', 
                }} 
                onClick={navigateToAllTasksPage}
            >
                <Typography variant="h6">View all</Typography>
                <IconButton>
                    <ArrowRightIcon />
                </IconButton>
            </Box>

            <Dialog open={isOpen} onClose={closeModal} maxWidth="sm" fullWidth>
                <DialogContent>
                    <AddTaskForm  
                        onSave={handleAddTask} 
                        onClose={closeModal} 
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default TaskList;