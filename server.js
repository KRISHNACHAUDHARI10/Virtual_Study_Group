const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const cors = require("cors");
const colors = require("colors");
const http = require("http");
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

// Chat Socket.IO Logic
const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    console.log("New User:", name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send-message", (message) => {
    const userName = users[socket.id];
    socket.broadcast.emit("receive", { message, user: userName });
  });

  socket.on("disconnect", () => {
    const userName = users[socket.id];
    if (userName) {
      socket.broadcast.emit("user-left", userName);
      delete users[socket.id];
    }
  });
});

// Import Routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/taskRoutes");
const noteRoutes = require("./routes/noteRoutes");
const subscribeRoutes = require("./routes/subscribe");

// Middleware setup - ORDER MATTERS!
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware BEFORE routes
app.use(
  session({
    secret: "anyStrongSecretHere",
    resave: false,
    saveUninitialized: false, // Changed to false for better security
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);
app.use(flash());

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://krishnachaudhari0340_boxselling:ZUjCPWQcMVtI41TZ@cluster1.evfh7yz.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("🗄️  MongoDB connected Successfully".bgGreen))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if DB connection fails
  });

// API Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/subscribe", subscribeRoutes);

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
  res.sendFile(path.join(__dirname, "public", "Home.html")); // Note: Capital H
});

app.get("/task", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Task.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Notes.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

app.get("/chatgroup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chatgroup.html"));
});

// Enhanced Error handling middleware with detailed logging
app.use((err, req, res, next) => {
  console.error("❌ Error occurred:".bgRed);
  console.error("Path:", req.path);
  console.error("Method:", req.method);
  console.error("Error Stack:", err.stack);
  
  // Send detailed error in development, generic in production
  if (process.env.NODE_ENV === 'development') {
    res.status(500).json({
      error: 'Something went wrong!',
      message: err.message,
      stack: err.stack
    });
  } else {
    res.status(500).json({
      error: 'Something went wrong!',
      message: 'Internal server error'
    });
  }
});

// 404 handler
app.use((req, res) => {
  console.log("404 - Page not found:", req.path);
  res.status(404).send("Page not found");
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(
    `🌍  Server running with Express + Socket.IO on http://localhost:${PORT}`
      .bgMagenta
  );
});
