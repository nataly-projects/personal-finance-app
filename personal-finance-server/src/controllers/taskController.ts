import { Response } from 'express';
import { Task } from '../models/Task';
import { logger } from '../utils/logger';
import {
  AddTaskRequest,
  AddTaskResponse,
  GetTasksResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  DeleteTaskResponse
} from '@shared/types/task';
import { AuthenticatedRequest } from '../utils/types';
import { asyncHandler } from '../middleware/errorMiddleware';
import { ApiError } from '../utils/utils';


export const addTask = asyncHandler (async (req: AuthenticatedRequest, res: Response<AddTaskResponse>) => {
  const userId = req.user.id;
  
  const { title, description, dueDate } = req.body as AddTaskRequest;
  
  if (!title) {
    logger.warn("Add task failed: Missing title");
    throw new ApiError(400, "Task title is required");
  }
    
  const task = new Task({ 
    title, 
    description, 
    dueDate,
    completed: false,
    userId 
  });
    
  await task.save();
  logger.info(`Task added successfully for user ID: ${userId}`);
  res.status(201).json({
    success: true,
    task: task.toObject() as any   
  });
});

export const getTasks = asyncHandler( async (req: AuthenticatedRequest, res: Response<GetTasksResponse>) => {
  const userId = req.user.id;
  const tasks = await Task.find({ userId })
    .sort({ completed: 1, dueDate: 1, createdAt: -1 });
    
  if (!tasks || tasks.length === 0) {
    logger.info(`No tasks found for user ID: ${userId}`);
    return res.status(200).json({ success: true, tasks: [] });
  }

  logger.info(`Tasks fetched successfully for user ID: ${userId}`);
  res.status(200).json({
    success: true,
    tasks: tasks.map(t => t.toObject()) as any
  });
});

export const updateTask = asyncHandler (async (req: AuthenticatedRequest, res: Response<UpdateTaskResponse>) => {
  const userId = req.user.id;
  const { id } = req.params;

  const updateData = req.body as UpdateTaskRequest;
    
  if (updateData.title === '') {
    logger.warn("Update task failed: Empty title");
    throw new ApiError(400, "Task title cannot be empty");
  }
    
  const task = await Task.findOneAndUpdate(
    { _id: id, userId },
    { ...updateData, updatedAt: new Date() },
    { new: true }
  );
    
  if (!task) {
    logger.warn(`Update task failed: Task not found for ID: ${id}`);
    throw new ApiError(404, "Task not found");
  }

  logger.info(`Task updated successfully for ID: ${id}`);
  res.status(200).json({
    success: true,
    task: task.toObject() as any
  });

});

export const deleteTask = asyncHandler (async (req: AuthenticatedRequest, res: Response<DeleteTaskResponse>) => {
  const userId = req.user.id;
  const { id } = req.params;
  const task = await Task.findOneAndDelete({ _id: id, userId });
    
  if (!task) {
    logger.warn(`Delete task failed: Task not found for ID: ${id}`);
    throw new ApiError(404, "Task not found");
  }
  
  logger.info(`Task deleted successfully for ID: ${id}`);
  res.status(200).json({ success: true });
}); 