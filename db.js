const Database = require("better-sqlite3");
const path = require("path");

// Open (and create if it doesn't exist) the SQLite database
const db = new Database(path.join(__dirname, "tasks.db"));

// Create the tasks table if it does not already exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
  )
`);

// Seed three example tasks only if the table is empty
const rowCount = db.prepare("SELECT COUNT(*) AS count FROM tasks").get().count;

if (rowCount === 0) {
  const insertTask = db.prepare("INSERT INTO tasks (title, done) VALUES (?, ?)");
  insertTask.run("Learn Express", 0);
  insertTask.run("Build a CRUD API", 0);
  insertTask.run("Test with Swagger UI", 1);
}

module.exports = db;
