const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch tasks",
      details: err.message,
    });
  }
});

// POST a new task
router.post("/", async (req, res) => {
  try {
    const { name, assignedTo, dueDate, done } = req.body;

    if (!name || !assignedTo || !dueDate) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    const newTask = new Task({
      name,
      assignedTo,
      dueDate,
      done: done || false,
    });

    const savedTask = await newTask.save();
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: savedTask,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Failed to create task",
      details: err.message,
    });
  }
});

// DELETE a task by ID
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to delete task",
      details: err.message,
    });
  }
});

// PUT (update) a task by ID
router.put("/:id", async (req, res) => {
  try {
    const { name, assignedTo, dueDate, done } = req.body;

    if (!name || !assignedTo || !dueDate) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { name, assignedTo, dueDate, done },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Failed to update task",
      details: err.message,
    });
  }
});

module.exports = router;
