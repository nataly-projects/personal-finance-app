import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {Task} from '../utils/types'
import API from '../services/api';

export const useTasks = () => {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading: loading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await API.get('/tasks');
      return response.data.tasks.map((task: Task) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : null
      }));
    }
  });

  const addMutation = useMutation({
    mutationFn: (newTask: Omit<Task, '_id'>) => API.post('/tasks', newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: any) => {
      console.error("Add task failed:", error.response?.data?.message || error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) => 
      API.put(`/tasks/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: any) => {
      console.error("Upsate task failed:", error.response?.data?.message || error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => API.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: any) => {
      console.error("Delete task failed:", error.response?.data?.message || error.message);
    }
  });



  return {
    tasks,
    loading,
    error,
    addTask: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    addError: addMutation.error, 

    updateTask:  updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    deleteTask: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};