const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');
const JWT_SECRET = process.env.JWT_SECRET || 'escape-room-secret';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function readDB(){
  try {
    const raw = fs.readFileSync(DB_PATH);
    return JSON.parse(raw);
  } catch(e) {
    return { users: [], rooms: [], puzzles: [] };
  }
}

function writeDB(db){
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// Auth: register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if(!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const db = readDB();
  if(db.users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already registered' });
  const hash = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), name: name || '', email, password: hash };
  db.users.push(user);
  writeDB(db);
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

// Auth: login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email === email);
  if(!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

// Middleware to protect routes
function authRequired(req, res, next){
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({ error: 'Authorization required' });
  const parts = auth.split(' ');
  if(parts.length !== 2) return res.status(401).json({ error: 'Invalid authorization format' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch(e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Rooms CRUD (public read, protected create/update/delete)
app.get('/api/rooms', (req, res) => {
  const db = readDB();
  res.json(db.rooms);
});

app.post('/api/rooms', authRequired, (req, res) => {
  const db = readDB();
  const { title, description } = req.body;
  const room = { id: Date.now().toString(), title: title || 'Untitled room', description: description || '', puzzles: [] };
  db.rooms.push(room);
  writeDB(db);
  res.json(room);
});

app.put('/api/rooms/:id', authRequired, (req, res) => {
  const db = readDB();
  const room = db.rooms.find(r => r.id === req.params.id);
  if(!room) return res.status(404).json({ error: 'Room not found' });
  Object.assign(room, req.body);
  writeDB(db);
  res.json(room);
});

app.delete('/api/rooms/:id', authRequired, (req, res) => {
  const db = readDB();
  const idx = db.rooms.findIndex(r => r.id === req.params.id);
  if(idx === -1) return res.status(404).json({ error: 'Room not found' });
  db.rooms.splice(idx, 1);
  writeDB(db);
  res.json({ success: true });
});

// Puzzles endpoints
app.get('/api/puzzles', (req, res) => {
  const db = readDB();
  res.json(db.puzzles);
});

app.post('/api/puzzles', authRequired, (req, res) => {
  const db = readDB();
  const { roomId, question, answer, meta } = req.body;
  const puzzle = { id: Date.now().toString(), roomId: roomId || null, question: question||'', answer: answer||'', meta: meta||{} };
  db.puzzles.push(puzzle);
  writeDB(db);
  res.json(puzzle);
});

// Serve frontend production build (if present)
const frontendBuild = path.join(__dirname, '..', 'build');
if (fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
}

// health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log('Backend listening on port', PORT));
