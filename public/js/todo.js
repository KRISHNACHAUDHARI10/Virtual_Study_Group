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
    status: "pending", // New tasks are always pending by default
  };

  try {
    let response;
    if (editingTaskId) {
      // If in edit mode, update the task
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
      // Add new task
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

    clearInputs();
    renderTaskTable();
    editingTaskId = null;
    addTaskBtn.textContent = "Add Task";
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
async function renderTaskTable() {
  try {
    const response = await fetch("/api/tasks");
    const data = await response.json();

    const tableBody = document.getElementById("task-table-body");
    tableBody.innerHTML = ""; // Clear old data

    if (!data.tasks || data.tasks.length === 0) {
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = `<td colspan="5">No tasks found. Add a new task!</td>`;
      tableBody.appendChild(emptyRow);
      return;
    }

    data.tasks.forEach((task) => {
      const formattedDate = new Date(task.dueDate).toLocaleDateString();

      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="${task.status === "done" ? "done-task" : ""}">${
        task.name
      }</td>
        <td class="${task.status === "done" ? "done-task" : ""}">${
        task.assignedTo
      }</td>
        <td class="${
          task.status === "done" ? "done-task" : ""
        }">${formattedDate}</td>
        <td>
          <button class="edit-btn" data-id="${task._id}">📝 Edit</button>
          <button class="delete-btn" data-id="${task._id}">🚫 Delete</button>
          ${
            task.status !== "done"
              ? `<button class="done-btn" data-id="${task._id}">✅ Done</button>`
              : ""
          }
        </td>
      `;

      tableBody.appendChild(row);

      // Edit button
      row.querySelector(".edit-btn").addEventListener("click", () => {
        taskNameInput.value = task.name;
        assignedToInput.value = task.assignedTo;
        dueDateInput.value = task.dueDate.split("T")[0];
        editingTaskId = task._id;
        addTaskBtn.textContent = "Update Task";
      });

      // Delete button
      row.querySelector(".delete-btn").addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete this task?")) {
          await fetch(`/api/tasks/${task._id}`, { method: "DELETE" });
          renderTaskTable();
        }
      });

      // Done button
      if (task.status !== "done") {
        row.querySelector(".done-btn").addEventListener("click", async () => {
          if (confirm("Mark this task as done?")) {
            try {
              // Send PATCH request to mark the task as done
              const response = await fetch(`/api/tasks/done/${task._id}`, {
                method: "PATCH", // Using PATCH for marking as done
                headers: { "Content-Type": "application/json" },
              });

              const data = await response.json();

              if (data.success) {
                // Task marked as done successfully, show confirmation message
                alert("Task marked as done  successfully!");

                // Optionally, re-render the task list or update the UI
                renderTaskTable();
              } else {
                alert("Failed to mark task as done!");
              }
            } catch (error) {
              console.error("Error marking task as done:", error);
              alert("An error occurred while marking the task as done.");
            }
          }
        });
      }
    });
  } catch (err) {
    console.error(err);
    showAlert("Error loading tasks");
  }
}

// Initial render
renderTaskTable();
