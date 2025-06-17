export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface AddTaskRequest {
  title: string;
  description?: string;
  dueDate?: Date;
}

export interface AddTaskResponse {
  success: boolean;
  task?: Task;
  error?: string;
}

export interface GetTasksResponse {
  success: boolean;
  tasks?: Task[];
  error?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueDate?: Date;
  completed?: boolean;
}

export interface UpdateTaskResponse {
  success: boolean;
  task?: Task;
  error?: string;
}

export interface DeleteTaskResponse {
  success: boolean;
  error?: string;
} 