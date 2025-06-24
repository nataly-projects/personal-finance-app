import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  setTasks, 
  addTask, 
  updateTask, 
  deleteTask,
  setLoading,
  setError,
  setOperationLoading
} from '../store/tasksSlice';
import {Task} from '../utils/types'
import API from '../services/api';

const parseTaskDates = (task: Task): Task => ({
  ...task,
  dueDate: task.dueDate ? new Date(task.dueDate) : null
});

export const useTasks = () => {
  const dispatch = useDispatch();
  const { items: tasks, loading, error, operationLoading } = useSelector((state: RootState) => state.tasks);
  const [localError, setLocalError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await API.get('/tasks');
      dispatch(setTasks(response.data.tasks));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading tasks';
      dispatch(setError(errorMessage));
      setLocalError(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addNewTask = async (taskData: Omit<Task, '_id'>) => {
    try {
      dispatch(setOperationLoading({ operation: 'add', loading: true }));
      dispatch(setError(null));
      const response = await API.post('/tasks', taskData);
      dispatch(addTask(response.data));
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error adding task';
      dispatch(setError(errorMessage));
      setLocalError(errorMessage);
      throw err;
    } finally {
      dispatch(setOperationLoading({ operation: 'add', loading: false }));
    }
  };

  const updateExistingTask = async (taskId: string, taskData: Partial<Task>) => {
    try {
      dispatch(setOperationLoading({ operation: 'update', loading: true }));
      dispatch(setError(null));
      const response = await API.put(`/tasks/${taskId}`, taskData);
      dispatch(updateTask(response.data));
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating task';
      dispatch(setError(errorMessage));
      setLocalError(errorMessage);
      throw err;
    } finally {
      dispatch(setOperationLoading({ operation: 'update', loading: false }));
    }
  };

  const deleteExistingTask = async (taskId: string) => {
    try {
      dispatch(setOperationLoading({ operation: 'delete', loading: true }));
      dispatch(setError(null));
      await API.delete(`/tasks/${taskId}`);
      dispatch(deleteTask(taskId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting task';
      dispatch(setError(errorMessage));
      setLocalError(errorMessage);
      throw err;
    } finally {
      dispatch(setOperationLoading({ operation: 'delete', loading: false }));
    }
  };

  const parsedTasks = tasks.map(parseTaskDates);

  return {
    tasks: parsedTasks,
    loading,
    error: error || localError,
    operationLoading,
    addTask: addNewTask,
    updateTask: updateExistingTask,
    deleteTask: deleteExistingTask,
    refreshTasks: fetchTasks
  };
};