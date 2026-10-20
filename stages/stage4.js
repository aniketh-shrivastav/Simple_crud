// Stage 4 adds PUT and DELETE. See app.js for the final integrated version,
// including the same validation, error handling, and all previous stages.
const express = require("express");
const app = express();
app.use(express.json());
let tasks = [
  { id: 1, title: "Learn Express", done: false },
  { id: 2, title: "Build a CRUD API", done: false },
  { id: 3, title: "Test with Swagger UI", done: true }
];
let nextId = 4;
app.get("/tasks", (req, res) => res.json(tasks));
app.get("/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: `Task ${req.params.id} not found` });
  res.json(task);
});
app.post("/tasks", (req, res) => {
  const { title } = req.body || {};
  if (typeof title !== "string" || !title.trim()) return res.status(400).json({ error: "title is required" });
  const task = { id: nextId++, title: title.trim(), done: false };
  tasks.push(task);
  res.status(201).json(task);
});
app.put("/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: `Task ${req.params.id} not found` });
  const body = req.body || {};
  if (!Object.keys(body).length) return res.status(400).json({ error: "Request body cannot be empty" });
  if ("title" in body && (typeof body.title !== "string" || !body.title.trim())) return res.status(400).json({ error: "title must be non-empty" });
  if ("done" in body && typeof body.done !== "boolean") return res.status(400).json({ error: "done must be a boolean" });
  if ("title" in body) task.title = body.title.trim();
  if ("done" in body) task.done = body.done;
  res.json(task);
});
app.delete("/tasks/:id", (req, res) => {
  const index = tasks.findIndex(t => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: `Task ${req.params.id} not found` });
  tasks.splice(index, 1);
  res.status(204).send();
});
app.listen(3000, () => console.log("Server running at http://localhost:3000"));
