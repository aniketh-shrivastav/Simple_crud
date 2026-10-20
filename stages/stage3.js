const express = require("express");
const app = express();
app.use(express.json());
const tasks = [
  { id: 1, title: "Learn Express", done: false },
  { id: 2, title: "Build a CRUD API", done: false },
  { id: 3, title: "Test with Swagger UI", done: true }
];
let nextId = 4;
app.get("/", (req, res) => res.json({ name: "Task API", version: "1.0.0", endpoints: ["/tasks"] }));
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/tasks", (req, res) => res.json(tasks));
app.get("/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: `Task ${req.params.id} not found` });
  res.json(task);
});
app.post("/tasks", (req, res) => {
  const { title } = req.body || {};
  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "title is required and must be a non-empty string" });
  }
  const task = { id: nextId++, title: title.trim(), done: false };
  tasks.push(task);
  res.status(201).json(task);
});
app.listen(3000, () => console.log("Server running at http://localhost:3000"));
