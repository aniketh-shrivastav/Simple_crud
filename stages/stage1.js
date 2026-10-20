const express = require("express");
const app = express();
app.get("/", (req, res) => res.status(200).json({
  name: "Task API", version: "1.0.0", endpoints: ["/tasks"]
}));
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
app.listen(3000, () => console.log("Server running at http://localhost:3000"));
