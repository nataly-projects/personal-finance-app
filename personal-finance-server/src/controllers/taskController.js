const Task = require("../models/Task");
const logger = require('../logger');  

async function getUserTasks(req, res) {
  try {
    if (!req.user || !req.user.id) {
      logger.warn("Get tasks failed: User not authenticated");
      return res.status(401).json({ message: "User not authenticated" });
    }

    const tasks = await Task.find({ userId: req.user.id });
    if (!tasks || tasks.length === 0) {
      logger.info(`No tasks found for user ID: ${req.user.id}`);
      return res.status(404).json({ message: "No tasks found" });
    }

    logger.info(`Tasks fetched successfully for user ID: ${req.user.id}`);
    res.status(200).json(tasks);
  } catch (error) {
    logger.error(`Error fetching tasks for user ID: ${req.user.id}:`, error);
    res.status(500).json({ error: error.message });
  }
}

async function addUserTask(req, res) {
  try {
    if (!req.user || !req.user.id) {
      logger.warn("Add task failed: User not authenticated");
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { title, description, dueDate } = req.body;
    if (!title || !description || !dueDate) {
      logger.warn("Add task failed: Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const task = new Task({
      ...req.body,
      userId: req.user.id
    });
    await task.save();
    logger.info(`Task added successfully for user ID: ${req.user.id}`);
    res.status(201).json(task);
  } catch (error) {
    logger.error(`Error adding task for user ID: ${req.user.id}:`, error);
    res.status(400).json({ error: error.message });
  }
}

async function updateUserTask(req, res) {
  try {
    if (!req.user || !req.user.id) {
      logger.warn("Update task failed: User not authenticated");
      return res.status(401).json({ message: "User not authenticated" });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true }
    );

    if (!task) {
      logger.warn(`Update task failed: Task not found for ID: ${req.params.taskId}`);
      return res.status(404).json({ message: "Task not found" });
    }

    logger.info(`Task updated successfully for ID: ${req.params.taskId}`);
    res.status(200).json(task);
  } catch (error) {
    logger.error(`Error updating task for ID: ${req.params.taskId}:`, error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteUserTask(req, res) {
  try {
    if (!req.user || !req.user.id) {
      logger.warn("Delete task failed: User not authenticated");
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const task = await Task.findByIdAndDelete(req.params.taskId);
    if (!task) {
      logger.warn(`Delete task failed: Task not found for ID: ${req.params.taskId}`);
      return res.status(404).json({ message: "Task not found" });
    }

    logger.info(`Task deleted successfully for ID: ${req.params.taskId}`);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting task for ID: ${req.params.taskId}:`, error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getUserTasks,
  addUserTask,
  updateUserTask,
  deleteUserTask
}; 