// Get DOM elements
const taskNameInput = document.getElementById("taskName");
const assignedToInput = document.getElementById("assignedTo");
const dueDateInput = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const alertOverlay = document.getElementById("alertOverlay");
const alertMessage = document.getElementById("alertMessage");
const alertOkBtn = document.getElementById("alertOkBtn");

// Variable to track if we are editing a task
let editingTaskId = null;

// Show alert message
function showAlert(message) {
  alertMessage.textContent = message;
  alertOverlay.style.display = "block";
}

// Hide alert on OK button click
alertOkBtn.addEventListener("click", () => {
  alertOverlay.style.display = "none";
});

// Event listener to add or update task
addTaskBtn.addEventListener("click", async () => {
  const taskName = taskNameInput.value.trim();
  const assignedTo = assignedToInput.value.trim();
  const dueDate = dueDateInput.value;

  if (!taskName || !assignedTo || !dueDate) {
    showAlert("Please fill out all fields");
    return;
  }

  addTaskBtn.disabled = true;

  const taskData = {
    name: taskName,
    assignedTo: assignedTo,
    dueDate: dueDate,
  };

  try {
    let response;
    if (editingTaskId) {
      // If in edit mode, update the task using PUT
      response = await fetch(`/api/tasks/${editingTaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showAlert("Task updated successfully");
      } else {
        showAlert(data.message || "Failed to update task");
      }
    } else {
      // If not in edit mode, add a new task using POST
      response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showAlert("Task added successfully");
      } else {
        showAlert(data.message || "Failed to add task");
      }
    }

    // Clear inputs and reset edit mode
    clearInputs();
    renderTaskTable(); // Correct function to render tasks
    editingTaskId = null; // Reset the edit mode
    addTaskBtn.textContent = "Add Task"; // Reset the button text
  } catch (err) {
    console.error(err);
    showAlert("Error saving task");
  } finally {
    addTaskBtn.disabled = false;
  }
});

// Function to clear input fields after add/update
function clearInputs() {
  taskNameInput.value = "";
  assignedToInput.value = "";
  dueDateInput.value = "";
}

// Render task list
// Fetch and render tasks
async function renderTaskTable() {
  try {
    const response = await fetch("/api/tasks");
    const data = await response.json();

    const tableBody = document.getElementById("task-table-body");
    tableBody.innerHTML = ""; // Clear old data

    if (!data.tasks || data.tasks.length === 0) {
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = `<td colspan="4">No tasks found. Add a new task!</td>`;
      tableBody.appendChild(emptyRow);
      return;
    }

    data.tasks.forEach((task) => {
      const formattedDate = new Date(task.dueDate).toLocaleDateString();

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${task.name}</td>
        <td>${task.assignedTo}</td>
        <td>${formattedDate}</td>
        <td>
          <button class="edit-btn" data-id="${task._id}">📝  Edit</button>
          <button class="delete-btn" data-id="${task._id}">🚫 Delete</button>
        </td>
      `;

      tableBody.appendChild(row);

      // Edit button
      row.querySelector(".edit-btn").addEventListener("click", () => {
        // Fill the top input fields
        taskNameInput.value = task.name;
        assignedToInput.value = task.assignedTo;
        dueDateInput.value = task.dueDate.split("T")[0];

        // Set editing mode
        editingTaskId = task._id;

        // Change button text to Update
        addTaskBtn.textContent = "Update Task";
      });

      // Delete button
      row.querySelector(".delete-btn").addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete this task?")) {
          await fetch(`/api/tasks/${task._id}`, { method: "DELETE" });
          renderTaskTable();
        }
      });
    });
  } catch (err) {
    console.error(err);
    alert("Error loading tasks");
  }
}

// Initial render
renderTaskTable();
