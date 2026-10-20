# Task CRUD API

A beginner-friendly REST API built with Node.js, Express, in-memory task data, and Swagger UI. It follows the FlyRank Week 2 CRUD API assignment.

## Requirements

- Node.js 18+ (or a recent LTS release)
- npm
- Git (for publishing to GitHub)

## Install and run

```bash
npm install
npm start
```

The API runs at `http://localhost:3000`.

- API information: http://localhost:3000/
- Health check: http://localhost:3000/health
- Swagger UI: http://localhost:3000/docs

**Note:** Tasks are stored in memory. Restarting the server resets the data to the three sample tasks.

## Endpoints

| Method | Path | Purpose | Success status |
|---|---|---|---|
| GET | `/` | API information | 200 |
| GET | `/health` | Health check | 200 |
| GET | `/tasks` | List all tasks | 200 |
| GET | `/tasks/:id` | Get one task | 200 |
| POST | `/tasks` | Create task | 201 |
| PUT | `/tasks/:id` | Update title and/or done | 200 |
| DELETE | `/tasks/:id` | Delete task | 204 |

Errors use `400` for invalid input and `404` for an unknown task ID, with a JSON `error` message.

## Test with curl

List tasks:

```bash
curl -i http://localhost:3000/tasks
```

Get one task:

```bash
curl -i http://localhost:3000/tasks/1
```

Create a task:

```bash
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk"}'
```

Invalid create request (should return 400):

```bash
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{}'
```

Update a task:

```bash
curl -i -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"done":true}'
```

Delete a task:

```bash
curl -i -X DELETE http://localhost:3000/tasks/1
```

Unknown task (should return 404):

```bash
curl -i http://localhost:3000/tasks/99
```

## Swagger UI

Open `http://localhost:3000/docs` after starting the server. Use **Try it out** to test the full CRUD cycle. Add a screenshot of the Swagger page here before submitting:

`![Swagger UI screenshot](docs/swagger-screenshot.png)`

## Assignment stages

- Stage 0: Start the Express server.
- Stage 1: Add root API information and `/health`.
- Stage 2: Add read endpoints.
- Stage 3: Add create endpoint and input validation.
- Stage 4: Add update and delete endpoints.
- Stage 5: Add Swagger UI documentation.
- Stage 6: Publish the repository and document it.

The `stages/` folder contains incremental learning snapshots. The final integrated implementation is `app.js`.

## Publish to GitHub

Create a **public** repository on GitHub, then run these commands from this folder (replace the URL with your own repository URL):

```bash
git init
git add .
git commit -m "Stage 0: hello server"
git add .
git commit -m "Stage 1: root and health endpoints"
git add .
git commit -m "Stage 2: read endpoints with 404"
git add .
git commit -m "Stage 3: create with validation"
git add .
git commit -m "Stage 4: full CRUD"
git add .
git commit -m "Stage 5: Swagger UI"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

For a genuine one-commit-per-stage history, make and commit each stage's code changes as you build it instead of creating all commits at the end.
