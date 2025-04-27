const socket = io("http://localhost:3000");

// Get DOM elements
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInput");
const messageContainer = document.querySelector(".container");
const joinSound = document.getElementById("join-sound");

// Function to get current time
const getCurrentTime = () => {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;
  return `${hours}:${minutes}`;
};

// Function to append messages
const append = (content, position, username = null) => {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", position);

  if (username) {
    const nameElement = document.createElement("div");
    nameElement.classList.add("username");
    nameElement.textContent = username;
    messageElement.appendChild(nameElement);
  }

  const contentElement = document.createElement("div");
  contentElement.classList.add("message-content");
  contentElement.textContent = content;
  messageElement.appendChild(contentElement);

  const timeElement = document.createElement("div");
  timeElement.classList.add("timestamp");
  timeElement.textContent = getCurrentTime();
  messageElement.appendChild(timeElement);

  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

// Play join sound function
const playJoinSound = () => {
  joinSound.currentTime = 0; // Rewind to start
  joinSound.play().catch((e) => console.log("Audio play failed:", e));
};

// Message sending
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;

  append(message, "right", "You");
  socket.emit("send-message", message);
  messageInput.value = "";
});

// User joins
const name = prompt("Enter your name to join:") || "Anonymous";
socket.emit("new-user-joined", name);

// Listen for join events
socket.on("user-joined", (name) => {
  playJoinSound(); // Play sound when someone joins
  append(`${name} joined the chat`, "right");
});

// Other socket listeners
socket.on("receive", (data) => {
  append(data.message, "left", data.user);
});

socket.on("user-left", (name) => {
  append(`${name} left the chat`, "right");
});

messageInput.focus();
