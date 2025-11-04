// server/server.js
const express = require('express');
const cors = require('cors');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { nanoid } = require('nanoid');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// lowdb setup - stores data in server/db.json
const dbFile = path.join(__dirname, 'db.json');
const adapter = new JSONFile(dbFile);
const db = new Low(adapter);

async function initDB() {
  await db.read();
  db.data = db.data || { books: [] };
  await db.write();
}

initDB().catch(err => console.error('DB init error:', err));

// API endpoints
app.get('/api/books', async (req, res) => {
  await db.read();
  res.json(db.data.books);
});

app.post('/api/books', async (req, res) => {
  const { title, author, pages, read } = req.body;
  const book = { id: nanoid(), title, author, pages, read: !!read };
  await db.read();
  db.data.books.push(book);
  await db.write();
  res.status(201).json(book);
});

app.put('/api/books/:id', async (req, res) => {
  const id = req.params.id;
  await db.read();
  const idx = db.data.books.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).send('Not found');
  db.data.books[idx] = { ...db.data.books[idx], ...req.body };
  await db.write();
  res.json(db.data.books[idx]);
});

app.delete('/api/books/:id', async (req, res) => {
  const id = req.params.id;
  await db.read();
  const before = db.data.books.length;
  db.data.books = db.data.books.filter(b => b.id !== id);
  await db.write();
  res.json({ deleted: before - db.data.books.length });
});

// Serve frontend static files from dist/ if present
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // serve index.html for any unknown route (SPA)
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
