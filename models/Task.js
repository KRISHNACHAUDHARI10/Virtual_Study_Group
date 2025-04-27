const mongoose = require("mongoose");

// Task schema definition
const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Task name is required"],
  },
  assignedTo: {
    type: String,
    required: [true, "Assigned user is required"],
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: [true, "Due date is required"],
  },
  done: {
    type: Boolean,
    default: false,
  },
});

// Creating and exporting the Task model
module.exports = mongoose.model("Task", taskSchema);
