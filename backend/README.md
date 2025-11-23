EscapeRoom - Integrated Express backend
======================================

This backend was automatically added to your project under /backend.

Quick start:
  1. Open a terminal.
  2. cd backend
  3. npm install
  4. npm start
  5. Backend runs on http://localhost:5000 by default

Endpoints (basic):
  POST /api/auth/register    { name, email, password }
  POST /api/auth/login       { email, password }
  GET  /api/rooms
  POST /api/rooms            (protected) { title, description }
  PUT  /api/rooms/:id        (protected)
  DELETE /api/rooms/:id      (protected)
  GET  /api/puzzles
  POST /api/puzzles          (protected) { roomId, question, answer, meta }
  GET  /api/health

Notes:
  - This backend uses a simple JSON file at backend/data/db.json for storage.
  - For production use, replace with a proper database.
  - JWT secret is 'escape-room-secret' by default. Set env var JWT_SECRET in production.
