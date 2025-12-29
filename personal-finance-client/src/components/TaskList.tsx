import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom'; 
import { IconButton, Typography, Box, Dialog, DialogContent } from '@mui/material';
import { Add as AddIcon, ArrowRight as ArrowRightIcon } from '@mui/icons-material';
import { TaskListProps, Task, TaskFormData, TaskStatus } from '../utils/types';
import AddTaskModal from './AddTaskModal';
import { List } from '@mui/material';
import TaskItem from './TaskItem';
import { useTasks } from '../hooks/useTasks';
import { useModal } from '../hooks/useModal';

const TaskList: React.FC<TaskListProps> = ({ propTasks }) => {
    const { tasks, addTask, updateTask, deleteTask } = useTasks();
    const navigate = useNavigate();
    const { isOpen, openModal, closeModal } = useModal();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const displayTasks = propTasks || tasks;

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
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        try{
            const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
            await updateTask({id, data: { 
            status: newStatus,
            completed: newStatus === 'completed'
        }});
        } catch (error) {
        }
    };

    const navigateToAllTasksPage = () => {
        navigate('/tasks');
    };

    const handleOpenAdd = () => {
        setSelectedTask(null); 
        openModal();
    };

    return (
        <Box sx={{ 
            padding: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            backgroundColor: 'background.paper', 
            borderRadius: 2,
            justifyContent: 'space-between', 
            height: '100%' 
        }}>          
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="h6" fontWeight="bold">Tasks</Typography>
                <IconButton onClick={openModal} color="primary">
                    <AddIcon />
                </IconButton>
            </Box>

            <List sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 400 }}>
                {displayTasks.length === 0 ? (
                    <Typography variant="body2" sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                        No tasks found
                    </Typography>
                ) : (
                    displayTasks.map((task) => (
                        <TaskItem 
                            key={task._id} 
                            task={task} 
                            onToggleComplete={handleToggleStatus}
                            onDelete={deleteTask}
                        />
                    ))
                )}
            </List>
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'pointer',
                    mt: 2,
                    pt: 1,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { opacity: 0.7 }
                }} 
                onClick={() => navigate('/tasks')}
            >
                <Typography variant="subtitle2" fontWeight="bold">View all tasks</Typography>
                <ArrowRightIcon fontSize="small" />
            </Box>
            
            <AddTaskModal 
                open={isOpen} 
                onClose={closeModal} 
                selectedTask={selectedTask}
            />
            
        </Box>
    );
};

export default TaskList;