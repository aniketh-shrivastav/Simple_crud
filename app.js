const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openapi = require("./openapi.json");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Stage 1: API information and health check.
app.get("/", (req, res) => {
  res.status(200).json({
    name: "Task API",
    version: "1.0.0",
    endpoints: [
      "GET /tasks",
      "GET /tasks/:id",
      "POST /tasks",
      "PUT /tasks/:id",
      "DELETE /tasks/:id"
    ]
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Stage 2: read all tasks and one task.
app.get("/tasks", (req, res) => {
  const rows = db.prepare("SELECT id, title, done FROM tasks").all();
  const taskList = rows.map((task) => ({
    id: task.id,
    title: task.title,
    done: Boolean(task.done)
  }));
  res.status(200).json(taskList);
});

app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

  if (!row) {
    return res.status(404).json({ error: "Task not found" });
  }

  return res.status(200).json({ id: row.id, title: row.title, done: Boolean(row.done) });
});

// Stage 3: create a task with validation.
app.post("/tasks", (req, res) => {
  const { title } = req.body || {};

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "title is required and must be a non-empty string" });
  }

  const result = db.prepare("INSERT INTO tasks (title, done) VALUES (?, 0)").run(title.trim());
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(result.lastInsertRowid);
  return res.status(201).json({ id: task.id, title: task.title, done: Boolean(task.done) });
});

// Stage 4: update a task and delete a task.
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

  if (!existing) {
    return res.status(404).json({ error: "Task not found" });
  }

  const body = req.body || {};
  const allowedKeys = ["title", "done"];
  const keys = Object.keys(body);

  if (keys.length === 0 || keys.some((key) => !allowedKeys.includes(key))) {
    return res.status(400).json({ error: "Provide title and/or done; no unknown fields are allowed" });
  }

  if ("title" in body && (typeof body.title !== "string" || body.title.trim() === "")) {
    return res.status(400).json({ error: "title must be a non-empty string" });
  }

  if ("done" in body && typeof body.done !== "boolean") {
    return res.status(400).json({ error: "done must be a boolean" });
  }

  const newTitle = "title" in body ? body.title.trim() : existing.title;
  const newDone = "done" in body ? (body.done ? 1 : 0) : existing.done;

  db.prepare("UPDATE tasks SET title = ?, done = ? WHERE id = ?").run(newTitle, newDone, id);
  const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
  return res.status(200).json({ id: updated.id, title: updated.title, done: Boolean(updated.done) });
});

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

  if (!existing) {
    return res.status(404).json({ error: "Task not found" });
  }

  db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
  return res.status(204).send();
});

// Stage 5: interactive API documentation.
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

// JSON parse errors should return a consistent 400 response.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON request body" });
  }
  return next(err);
});

app.listen(PORT, () => {
  console.log(`Task API running at http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/docs`);
});
