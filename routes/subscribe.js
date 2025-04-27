// routes/subscribe.js
const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");

// POST /api/subscribe
router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      
      return res.status(400).json({ error: "Email already subscribed" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
