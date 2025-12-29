import React, { useState } from 'react';
import { Dialog, DialogContent} from '@mui/material';
import { useTasks } from '../hooks/useTasks';
import AddTaskForm from './AddTaskForm';
import { Task } from '../utils/types';

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  selectedTask: Task | null;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ open, onClose, onSuccess, selectedTask }) => {
    const { loading, error, addTask, updateTask } = useTasks();
  // const [formData, setFormData] = useState({
  //   title: '',
  //   description: '',
  //   dueDate: '',
  //   status: 'pending',
  // });

  
  const handleSubmit = async (taskData: any) => {
    try {
        if (selectedTask) {
            await updateTask({id: selectedTask._id, data: taskData});
        } else {
            await addTask(taskData);
      }
        onSuccess?.();
        onClose();
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

//   useEffect(() => {
//     if (selectedTask) {
//       setFormData({
//         title: selectedTask.title || '',
//         description: selectedTask.description || '',
//         dueDate: selectedTask.dueDate ? new Date(selectedTask.dueDate).toISOString().split('T')[0] : '',
//         status: selectedTask.status || 'pending',
//       });
//     } else {
//       setFormData({ title: '', description: '', dueDate: '', status: 'pending' });
//     }
//   }, [selectedTask, open]);


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogContent>
            <AddTaskForm
                onSuccess={handleSubmit}
                onClose={onClose}
                task={selectedTask}
            />
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;