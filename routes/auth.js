const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register Route

router.post("/register", async (req, res) => {
  const { username, phone, course, password, email } = req.body;

  if (!username || !phone || !course || !password || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already exists" });

    const user = new User({ username, phone, course, email, password });

    await user.save();

    res.status(201).json({ message: "🎊  Registered successfully" });
  } catch (err) {
    console.error("Register error:", err);

    // Mongoose Validation Error Handling
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: errors.join(", ") });
    }

    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.userId = user._id;
    res.status(200).json({ message: "🎉  Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
