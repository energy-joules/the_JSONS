// index.js
require('dotenv').config();

const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./db');
const Event = require('./models/event');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Server running.");
});

app.get('/events', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit ?? '50', 10) || 50, 200);
    const docs = await Event.find()
      .sort({ date: 1, createdAt: -1 })
      .limit(limit)
      .lean();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err?.message ?? err) });
  }
});

app.get('/events/search', async (req, res) => {
  try {
    const q = String(req.query.q ?? '').trim();
    const limit = Math.min(parseInt(req.query.limit ?? '50', 10) || 50, 200);

    if (!q) {
      return res.status(400).json({ ok: false, error: 'Missing query param `q`.' });
    }

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');

    const docs = await Event.find({ name: regex })
      .sort({ date: 1, createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({ ok: true, q, count: docs.length, results: docs });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err?.message ?? err) });
  }
});

app.get('/health', (req, res) => {
  const state = mongoose.connection.readyState;  // 0=disconnected,1=connected,2=connecting,3=disconnecting
  res.json({
    ok: true,
    db: {
      state,
      stateLabel: ['disconnected', 'connected', 'connecting', 'disconnecting'][state] ?? 'unknown',
      name: mongoose.connection.name ?? null,
      host: mongoose.connection.host ?? null,
    },
  });
});

// ...

const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});