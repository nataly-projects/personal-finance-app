import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { IconButton, Typography, Box, Dialog, DialogContent } from '@mui/material';
import { Add as AddIcon, ArrowRight as ArrowRightIcon } from '@mui/icons-material';
import { TaskListProps, Task, TaskFormData } from '../utils/types';
import API from "../services/api";
import AddTaskForm from './AddTaskForm';
import { List, ListItem, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const TaskList: React.FC<TaskListProps> = ({ propTasks }) => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);

    useEffect(() => {
        setTasks(propTasks);
    }, [propTasks]);

    const handleAddTask = async (newTask: TaskFormData) => {
        const taskToSave: Task = { 
            ...newTask, 
            _id: "", 
            userId: "", 
            status: newTask.status || "pending",
            completed: newTask.status === 'completed',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        try {
            const response = await API.post("/users/tasks", taskToSave);
            setTasks([...tasks, response.data]);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDialogClose = () => {
        setIsAddTaskDialogOpen(false);
    };

    const handleAddTaskClick = () => {
        setIsAddTaskDialogOpen(true);
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

    const navigateToAllTasksPage = () => {
        navigate('/tasks');
    };

    return (
        <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', backgroundColor: '#fff',
            justifyContent: 'space-between', flex: '1' }}>
                        
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="h6">Open Tasks</Typography>
                <IconButton onClick={handleAddTaskClick} color="primary">
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
                <Typography variant="h6" >View all</Typography>
                <IconButton >
                    <ArrowRightIcon />
                </IconButton>
            </Box>
            <Dialog open={isAddTaskDialogOpen} onClose={handleDialogClose}>
                <DialogContent>
                    <AddTaskForm 
                        open={isAddTaskDialogOpen} 
                        onSave={handleAddTask} 
                        onClose={handleDialogClose} 
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default TaskList;