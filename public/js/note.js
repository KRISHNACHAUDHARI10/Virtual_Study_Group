const uploadForm = document.getElementById("upload-form");
const notesTable = document.getElementById("notes-table");
const tableBody = notesTable.querySelector("tbody");

// Handle form submission
uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(uploadForm);

  try {
    const response = await fetch("/api/notes/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      alert("Note uploaded successfully!");
      uploadForm.reset();
      showAllNotes();
    } else {
      alert(`Upload failed: ${result.error || "Unknown error"}`);
    }
  } catch (err) {
    console.error("Upload error:", err);
    alert("An error occurred while uploading the note.");
  }
});

// Function to fetch and show all notes
async function showAllNotes() {
  try {
    const response = await fetch("/api/notes");
    const notes = await response.json();

    tableBody.innerHTML = "";

    if (notes.length > 0) {
      notesTable.style.display = "table";

      notes.forEach((note) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${note.name}</td>
          <td>${note.description}</td>
          <td>${new Date(note.date).toLocaleDateString()}</td>
          <td><a class="edit-btn" href="/uploads/${
            note.file
          }" download >💾  Download</a></td>
          <td><button onclick="deleteNote('${
            note._id
          }')" class="delete-btn">🚫 Delete</button></td>
        `;

        tableBody.appendChild(tr);
      });
    } else {
      notesTable.style.display = "none";
      alert("No notes uploaded yet.");
    }
  } catch (err) {
    console.error("Fetch notes error:", err);
    alert("Failed to fetch notes.");
  }
}

// Function to delete a note
async function deleteNote(noteId) {
  try {
    const response = await fetch(`/api/notes/${noteId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (response.ok) {
      alert("Note deleted successfully!");
      showAllNotes(); // Refresh the notes list
    } else {
      alert(`Failed to delete note: ${result.error || "Unknown error"}`);
    }
  } catch (err) {
    console.error("Delete error:", err);
    alert("An error occurred while deleting the note.");
  }
}
