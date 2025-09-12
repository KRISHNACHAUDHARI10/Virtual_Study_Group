const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  assignedTo: { type: String, required: true },
  dueDate: { type: Date, required: true },
  done: { type: Boolean, default: false }, // Make sure 'done' is a Boolean
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
 