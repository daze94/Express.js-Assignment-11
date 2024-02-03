const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
const uniqid = require('uniqid');
var { notes } = require('./db/db.json');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    return note;
};

function filterOutNote(query, notesArray) {
    let filteredResults = notesArray;
    filteredResults = filteredResults.filter(
        note => note.id !== query);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: filteredResults }, null, 2)
    );
    return filteredResults;
};

app.get("/api/notes", (req, res) => {
    res.json(notes);
});

app.post("/api/notes", (req, res) => {
    req.body.id = uniqid();
    let note = createNewNote(req.body, notes);
    res.json(note);
});

app.delete("/api/notes/:id", (req, res) => {
    notes = filterOutNote(req.params.id, notes);
    res.json(notes);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Note-Taker API Server now on port ${PORT}! http://localhost:3001`);
});