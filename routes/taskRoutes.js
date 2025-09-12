const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Task = require("../models/Task");

// Helper function to check valid ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET all tasks (optional filtering: /api/tasks?done=true)
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.done) {
      filter.done = req.query.done === "true";
    }

    const tasks = await Task.find(filter);
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

    // Validate required fields
    if (!name || !assignedTo || !dueDate) {
      return res.status(400).json({
        success: false,
        error: "Name, AssignedTo, and DueDate are required fields.",
      });
    }

    // Create new task
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
    const { id } = req.params;

    // Validate task ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: "Invalid task ID" });
    }

    // Delete task
    const task = await Task.findByIdAndDelete(id);
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

// PUT (full update) a task by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, assignedTo, dueDate, done } = req.body;

    // Validate task ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: "Invalid task ID" });
    }

    // Validate required fields
    if (!name || !assignedTo || !dueDate) {
      return res.status(400).json({
        success: false,
        error: "Name, AssignedTo, and DueDate are required fields.",
      });
    }

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      id,
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

// PATCH (mark task as done)
// PATCH (mark task as done and delete)
router.patch("/done/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate task ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: "Invalid task ID" });
    }

    // Mark task as done
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { done: true }, // Setting task status to 'done'
      { new: true } // Return updated task
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Now delete the task after marking it as done
    await Task.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Task marked as done and deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to mark task as done and delete",
      details: err.message,
    });
  }
});

module.exports = router;
