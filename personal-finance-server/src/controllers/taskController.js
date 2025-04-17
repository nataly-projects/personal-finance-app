const Task = require("../models/Task");

async function getUserTasks(req, res) {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function addUserTask(req, res) {
  try {
    const task = new Task({
      ...req.body,
      userId: req.user.id
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateUserTask(req, res) {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteUserTask(req, res) {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getUserTasks,
  addUserTask,
  updateUserTask,
  deleteUserTask
}; 