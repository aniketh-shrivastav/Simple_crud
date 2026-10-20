const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openapi = require("./openapi.json");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory data: tasks disappear when the server restarts.
let tasks = [
  { id: 1, title: "Learn Express", done: false },
  { id: 2, title: "Build a CRUD API", done: false },
  { id: 3, title: "Test with Swagger UI", done: true }
];
let nextId = 4;

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
  res.status(200).json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  return res.status(200).json(task);
});

// Stage 3: create a task with validation.
app.post("/tasks", (req, res) => {
  const { title } = req.body || {};

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "title is required and must be a non-empty string" });
  }

  const task = {
    id: nextId++,
    title: title.trim(),
    done: false
  };

  tasks.push(task);
  return res.status(201).json(task);
});

// Stage 4: update a task and delete a task.
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
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

  if ("title" in body) task.title = body.title.trim();
  if ("done" in body) task.done = body.done;

  return res.status(200).json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  tasks.splice(index, 1);
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
