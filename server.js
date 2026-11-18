
const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const { randomUUID } = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

const dataFile = path.join(__dirname, "data", "notes.json");

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Read notes from JSON file
async function readNotes() {
    try {
        const data = await fs.readFile(dataFile, "utf8");
        return JSON.parse(data);
    } catch (error) {
        if (error.code === "ENOENT") {
            return [];
        }
        throw error;
    }
}

// Save notes to JSON file
async function saveNotes(notes) {
    await fs.writeFile(
        dataFile,
        JSON.stringify(notes, null, 2)
    );
}

// GET: Display all notes
app.get("/notes", async (req, res) => {
    try {
        const notes = await readNotes();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: "Unable to fetch notes" });
    }
});

// POST: Create a new note
app.post("/notes", async (req, res) => {
    try {
        const { title, content } = req.body;

        if (
            typeof title !== "string" ||
            typeof content !== "string" ||
            !title.trim() ||
            !content.trim()
        ) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const notes = await readNotes();

        const newNote = {
            id: randomUUID(),
            title: title.trim(),
            content: content.trim(),
            createdAt: new Date().toISOString()
        };

        notes.unshift(newNote);
        await saveNotes(notes);

        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: "Unable to create note" });
    }
});

// DELETE: Delete a note
app.delete("/notes/:id", async (req, res) => {
    try {
        const notes = await readNotes();

        const updatedNotes = notes.filter(
            note => note.id !== req.params.id
        );

        if (updatedNotes.length === notes.length) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        await saveNotes(updatedNotes);

        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Unable to delete note" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
