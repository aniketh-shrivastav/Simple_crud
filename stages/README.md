# Incremental stage snapshots

All learning snapshots have been consolidated into `stages.js`. This file demonstrates how the assignment grows stage by stage:

- `Stage 0`: hello server
- `Stage 1`: root and health endpoints
- `Stage 2`: list and single-task read endpoints
- `Stage 3`: create endpoint with title validation
- `Stage 4`: full CRUD routes
- `Stage 5`: Swagger wiring example

You can run any specific stage snapshot with `STAGE=<0-5> node stages/stages.js`.

For the complete, runnable production implementation with all routes, database persistence, and Swagger, use the root `app.js`.
