/**
 * Incremental Stage Snapshots (Stages 0 - 5)
 *
 * This file consolidates all incremental learning snapshots of the Task CRUD API
 * into a single reference file. For the complete, integrated production application,
 * see ../app.js.
 */

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openapi = require("../openapi.json");

// ============================================================================
// Stage 0: Hello Server
// Starts a minimal Express web server returning a simple text response.
// ============================================================================
function createStage0App() {
  const app = express();
  app.get("/", (req, res) => res.send("Hello, server!"));
  return app;
}

// ============================================================================
// Stage 1: Root API information and /health endpoints
// Adds JSON metadata endpoint and health-check route.
// ============================================================================
function createStage1App() {
  const app = express();
  app.get("/", (req, res) =>
    res.status(200).json({
      name: "Task API",
      version: "1.0.0",
      endpoints: ["/tasks"]
    })
  );
  app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
  return app;
}

// ============================================================================
// Stage 2: List and Single-Task Read Endpoints
// Introduces in-memory task list and GET /tasks, GET /tasks/:id.
// ============================================================================
function createStage2App() {
  const app = express();
  app.use(express.json());

  const tasks = [
    { id: 1, title: "Learn Express", done: false },
    { id: 2, title: "Build a CRUD API", done: false },
    { id: 3, title: "Test with Swagger UI", done: true }
  ];

  app.get("/", (req, res) =>
    res.json({ name: "Task API", version: "1.0.0", endpoints: ["/tasks"] })
  );
  app.get("/health", (req, res) => res.json({ status: "ok" }));

  app.get("/tasks", (req, res) => res.status(200).json(tasks));

  app.get("/tasks/:id", (req, res) => {
    const task = tasks.find((t) => t.id === Number(req.params.id));
    if (!task) return res.status(404).json({ error: `Task ${req.params.id} not found` });
    res.status(200).json(task);
  });

  return app;
}

// ============================================================================
// Stage 3: Create Endpoint with Title Validation
// Adds POST /tasks with validation for non-empty title string.
// ============================================================================
function createStage3App() {
  const app = express();
  app.use(express.json());

  const tasks = [
    { id: 1, title: "Learn Express", done: false },
    { id: 2, title: "Build a CRUD API", done: false },
    { id: 3, title: "Test with Swagger UI", done: true }
  ];
  let nextId = 4;

  app.get("/", (req, res) =>
    res.json({ name: "Task API", version: "1.0.0", endpoints: ["/tasks"] })
  );
  app.get("/health", (req, res) => res.json({ status: "ok" }));
  app.get("/tasks", (req, res) => res.json(tasks));

  app.get("/tasks/:id", (req, res) => {
    const task = tasks.find((t) => t.id === Number(req.params.id));
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

  return app;
}

// ============================================================================
// Stage 4: Full CRUD Routes (Update & Delete)
// Adds PUT /tasks/:id and DELETE /tasks/:id with body validation.
// ============================================================================
function createStage4App() {
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
    const task = tasks.find((t) => t.id === Number(req.params.id));
    if (!task) return res.status(404).json({ error: `Task ${req.params.id} not found` });
    res.json(task);
  });

  app.post("/tasks", (req, res) => {
    const { title } = req.body || {};
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "title is required" });
    }
    const task = { id: nextId++, title: title.trim(), done: false };
    tasks.push(task);
    res.status(201).json(task);
  });

  app.put("/tasks/:id", (req, res) => {
    const task = tasks.find((t) => t.id === Number(req.params.id));
    if (!task) return res.status(404).json({ error: `Task ${req.params.id} not found` });

    const body = req.body || {};
    if (!Object.keys(body).length) {
      return res.status(400).json({ error: "Request body cannot be empty" });
    }
    if ("title" in body && (typeof body.title !== "string" || !body.title.trim())) {
      return res.status(400).json({ error: "title must be non-empty" });
    }
    if ("done" in body && typeof body.done !== "boolean") {
      return res.status(400).json({ error: "done must be a boolean" });
    }

    if ("title" in body) task.title = body.title.trim();
    if ("done" in body) task.done = body.done;
    res.json(task);
  });

  app.delete("/tasks/:id", (req, res) => {
    const index = tasks.findIndex((t) => t.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ error: `Task ${req.params.id} not found` });
    tasks.splice(index, 1);
    res.status(204).send();
  });

  return app;
}

// ============================================================================
// Stage 5: Swagger UI Wiring
// Wires OpenAPI documentation via swagger-ui-express on /docs.
// ============================================================================
function createStage5App() {
  const app = createStage4App();
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));
  return app;
}

module.exports = {
  createStage0App,
  createStage1App,
  createStage2App,
  createStage3App,
  createStage4App,
  createStage5App
};

// Runnable CLI: STAGE=X node stages/stages.js (default stage 5)
if (require.main === module) {
  const stage = process.env.STAGE || "5";
  const stagesMap = {
    "0": createStage0App,
    "1": createStage1App,
    "2": createStage2App,
    "3": createStage3App,
    "4": createStage4App,
    "5": createStage5App
  };
  const factory = stagesMap[stage] || createStage5App;
  const app = factory();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Stage ${stage} running at http://localhost:${PORT}`);
  });
}
