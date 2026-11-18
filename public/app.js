
const noteForm = document.getElementById("noteForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const notesList = document.getElementById("notesList");
const message = document.getElementById("message");
const addButton = document.getElementById("addButton");

// Display messages
function showMessage(text) {
    message.textContent = text;
}

// Fetch and display all notes
async function loadNotes() {
    try {
        notesList.textContent = "Loading notes...";

        const response = await fetch("/notes");

        if (!response.ok) {
            throw new Error("Could not fetch notes");
        }

        const notes = await response.json();

        notesList.replaceChildren();

        if (notes.length === 0) {
            notesList.textContent = "No notes yet. Create your first note!";
            return;
        }

        notes.forEach(note => {
            const card = document.createElement("div");
            card.className = "note-card";

            const heading = document.createElement("h3");
            heading.textContent = note.title;

            const paragraph = document.createElement("p");
            paragraph.textContent = note.content;

            const date = document.createElement("small");
            date.textContent = new Date(note.createdAt).toLocaleString();

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-button";

            deleteButton.addEventListener("click", () => {
                deleteNote(note.id);
            });

            card.append(heading, paragraph, date, deleteButton);
            notesList.appendChild(card);
        });

    } catch (error) {
        notesList.textContent = "Unable to load notes. Please try again.";
        console.error(error);
    }
}

// Create a new note
noteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        showMessage("Please enter both title and content.");
        return;
    }

    addButton.disabled = true;
    showMessage("Saving note...");

    try {
        const response = await fetch("/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, content })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unable to save note");
        }

        noteForm.reset();
        showMessage("Note added successfully!");

        await loadNotes();

    } catch (error) {
        showMessage(error.message);
    } finally {
        addButton.disabled = false;
    }
});

// Delete a note
async function deleteNote(id) {
    try {
        const response = await fetch(`/notes/${encodeURIComponent(id)}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unable to delete note");
        }

        showMessage("Note deleted successfully!");
        await loadNotes();

    } catch (error) {
        showMessage(error.message);
    }
}

// Load notes when the page opens
loadNotes();
