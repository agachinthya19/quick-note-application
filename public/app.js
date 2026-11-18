
const noteForm = document.getElementById("noteForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const notesList = document.getElementById("notesList");
const message = document.getElementById("message");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Save notes
function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// Display all notes
function loadNotes() {
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

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", () => {
            deleteNote(note.id);
        });

        card.append(heading, paragraph, deleteButton);
        notesList.appendChild(card);
    });
}

// Add multiple notes
noteForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        message.textContent = "Please enter title and content.";
        return;
    }

    const newNote = {
        id: Date.now().toString() + Math.random(),
        title: title,
        content: content
    };

    notes.unshift(newNote);

    saveNotes();
    loadNotes();

    noteForm.reset();
    message.textContent = "Note added successfully!";
});

// Delete individual note
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);

    saveNotes();
    loadNotes();

    message.textContent = "Note deleted successfully!";
}

// Display notes when website opens
loadNotes();
