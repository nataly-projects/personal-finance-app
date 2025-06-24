import { Request, Response } from 'express';
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


export const addTask = async (req: AuthenticatedRequest, res: Response<AddTaskResponse>) => {
  const userId = req.user.id;
  try {
    const { title, description, dueDate } = req.body as AddTaskRequest;
    
    if (!title) {
      logger.warn("Add task failed: Missing title");
      return res.status(400).json({ success: false, error: "Task title is required" });
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
      task: {
        id: task.id.toString(),
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        completed: task.completed,
        userId: task.userId.toString(),
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }
    });
  } catch (error) {
    logger.error(`Error adding task for user ID: ${userId}:`, error);
    res.status(500).json({ success: false, error: "Server error, please try again later" });
  }
};

export const getTasks = async (req: AuthenticatedRequest, res: Response<GetTasksResponse>) => {
  const userId = req.user.id;
  try {
    const tasks = await Task.find({ userId })
      .sort({ completed: 1, dueDate: 1, createdAt: -1 });
    
    if (!tasks || tasks.length === 0) {
      logger.info(`No tasks found for user ID: ${userId}`);
      return res.status(200).json({ success: true, tasks: [] });
    }

    logger.info(`Tasks fetched successfully for user ID: ${userId}`);
    res.status(200).json({
      success: true,
      tasks: tasks.map(t => ({
        id: t.id.toString(),
        title: t.title,
        description: t.description,
        dueDate: t.dueDate,
        completed: t.completed,
        userId: t.userId.toString(),
        createdAt: t.createdAt,
        updatedAt: t.updatedAt
      }))
    });
  } catch (error) {
    logger.error(`Error fetching tasks for user ID: ${userId}:`, error);
    res.status(500).json({ success: false, error: "Server error, please try again later" });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response<UpdateTaskResponse>) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const updateData = req.body as UpdateTaskRequest;
    
    if (updateData.title === '') {
      logger.warn("Update task failed: Empty title");
      return res.status(400).json({ success: false, error: "Task title cannot be empty" });
    }
    
    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    
    if (!task) {
      logger.warn(`Update task failed: Task not found for ID: ${id}`);
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    logger.info(`Task updated successfully for ID: ${id}`);
    res.status(200).json({
      success: true,
      task: {
        id: task.id.toString(),
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        completed: task.completed,
        userId: task.userId.toString(),
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }
    });
  } catch (error) {
    logger.error(`Error updating task for ID: ${id}:`, error);
    res.status(500).json({ success: false, error: "Server error, please try again later" });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response<DeleteTaskResponse>) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const task = await Task.findOneAndDelete({ _id: id, userId });
    
    if (!task) {
      logger.warn(`Delete task failed: Task not found for ID: ${id}`);
      return res.status(404).json({ success: false, error: "Task not found" });
    }
    
    logger.info(`Task deleted successfully for ID: ${id}`);
    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(`Error deleting task for ID: ${id}:`, error);
    res.status(500).json({ success: false, error: "Server error, please try again later" });
  }
}; 