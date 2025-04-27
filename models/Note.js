// models/Note.js
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Note", noteSchema);
