import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../utils/types';

interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
  operationLoading: {
    add: boolean;
    update: boolean;
    delete: boolean;
  };
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
  operationLoading: {
    add: false,
    update: false,
    delete: false
  }
};

// פונקציית עזר להמרת תאריכים למחרוזות ISO
const serializeTask = (task: Task): Task => ({
  ...task,
  dueDate: task?.dueDate ? new Date(task.dueDate) : null
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.items = action.payload.map(serializeTask);
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.items.push(serializeTask(action.payload));
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.items.findIndex(task => task._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = serializeTask(action.payload);
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(task => task._id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setOperationLoading: (state, action: PayloadAction<{ operation: 'add' | 'update' | 'delete', loading: boolean }>) => {
      state.operationLoading[action.payload.operation] = action.payload.loading;
    }
  }
});

export const { 
  setTasks, 
  addTask, 
  updateTask, 
  deleteTask,
  setLoading,
  setError,
  setOperationLoading
} = tasksSlice.actions;

export default tasksSlice.reducer;