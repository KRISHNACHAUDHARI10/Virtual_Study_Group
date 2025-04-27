const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const cors = require("cors");
const colors = require("colors");
require("dotenv").config();
const http = require("http"); //
const { Server } = require("socket.io");

const app = express();

// Create HTTP Server from Express app
const server = http.createServer(app);

// Create Socket.IO server attached to HTTP server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

//  Chat Socket.IO Logic

const users = {};

io.on("connection", (socket) => {
  // New user joins
  socket.on("new-user-joined", (name) => {
    console.log("New User:", name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name); // Broadcast to all other users
  });

  // Handle message sending
  socket.on("send-message", (message) => {
    const userName = users[socket.id];
    socket.broadcast.emit("receive", { message, user: userName });
  });

  // Handle user disconnects
  socket.on("disconnect", () => {
    const userName = users[socket.id];
    if (userName) {
      socket.broadcast.emit("user-left", userName);
      delete users[socket.id];
    }
  });
});

// Express Middlewares and Routes

// Import Routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/taskRoutes");
const noteRoutes = require("./routes/noteRoutes");

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Session and Flash middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret123",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("🗄️  MongoDB connected Successfully".bgGreen))
  .catch((err) => console.error("MongoDB connection error:", err));

// API Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/auth", authRoutes);

// Static Frontend Routes
app.get("/", (req, res) => {
  res.redirect("/register");
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/task", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "task.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Notes.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const subscribeRoutes = require("./routes/subscribe");
app.use("/api/subscribe", subscribeRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(
    `🌍  Server running with Express + Socket.IO on http://localhost:${PORT}`
      .bgMagenta
  );
});
