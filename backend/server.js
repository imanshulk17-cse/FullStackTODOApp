const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Get all tasks
app.get('/tasks', (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ tasks: rows });
  });
});

// Add new task
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  db.run("INSERT INTO tasks (title) VALUES (?)", [title], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// Update task
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  db.run("UPDATE tasks SET title = ?, completed = ? WHERE id = ?", [title, completed, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

// Delete task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tasks WHERE id = ?", [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});