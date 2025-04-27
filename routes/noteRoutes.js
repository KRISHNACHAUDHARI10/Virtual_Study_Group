const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const Note = require("../models/Note");

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload a new note
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { name, description, date } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const newNote = new Note({
      name,
      description,
      date,
      file: req.file.filename,
    });

    await newNote.save();
    res.status(201).json({ message: "Note uploaded", note: newNote });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ date: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a note
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (!note.file) {
      return res.status(400).json({ error: "File information missing" });
    }

    const filePath = path.join(__dirname, "..", "uploads", note.file);
    console.log("Attempting to delete file:", filePath);

    // Ensure file exists before deleting
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      console.log("File deleted successfully");
    } catch (fileError) {
      // File does not exist OR cannot delete
      console.error("File operation error:", fileError);
      if (fileError.code !== "ENOENT") {
        // Ignore if file not found
        return res
          .status(500)
          .json({ error: "Error deleting file from server" });
      }
      // If the file already missing (ENOENT), continue with note deletion
    }

    // Remove the note from the database
    await note.deleteOne();
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ error: "Failed to delete the note" });
  }
});

module.exports = router;
