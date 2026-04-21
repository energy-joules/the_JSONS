// index.js
require('dotenv').config();

const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./db');
const Volunteer = require("./models/volunteer");
const Organization = require("./models/organization");
const bcrypt = require("bcryptjs");
const { signAuthToken, authRequired } = require("./auth");
const Event = require('./models/event');

const app = express();

// Connect to MongoDB
// Wait for DB before accepting requests that need it.
// (Otherwise auth requests can race the initial connection.)

// Middleware
app.use(
  cors({
    origin: "https://kindbridge-wmjo.onrender.com" || "http://localhost:5173",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Server running.");
});

function requireDb(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ ok: false, error: "Database unavailable." });
  }
  next();
}

app.post("/auth/register", requireDb, async (req, res) => {
  try {
    const accountType = String(req.body.accountType ?? "").toLowerCase();
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "");
    const phone = String(req.body.phone ?? "").trim();

    if (!accountType || !["volunteer", "organization"].includes(accountType)) {
      return res.status(400).json({ ok: false, error: "Invalid accountType." });
    }
    if (!email) return res.status(400).json({ ok: false, error: "Email is required." });
    if (!password) return res.status(400).json({ ok: false, error: "Password is required." });

    const passwordHash = await bcrypt.hash(password, 10);

    let user;
    if (accountType === "volunteer") {
      const firstName = String(req.body.firstName ?? "").trim();
      const lastName = String(req.body.lastName ?? "").trim();
      if (!firstName) return res.status(400).json({ ok: false, error: "First name is required." });
      if (!lastName) return res.status(400).json({ ok: false, error: "Last name is required." });

      user = await Volunteer.create({
        email,
        password: passwordHash,
        firstName,
        lastName,
        phone: phone || undefined,
      });
    } else {
      const organizationName = String(req.body.organizationName ?? "").trim();
      if (!organizationName) {
        return res.status(400).json({ ok: false, error: "Organization name is required." });
      }
      if (!phone) return res.status(400).json({ ok: false, error: "Phone is required." });

      user = await Organization.create({
        email,
        password: passwordHash,
        organizationName,
        phone,
      });
    }

    const token = signAuthToken({
      sub: String(user._id),
      accountType,
      email: user.email,
    });

    return res.json({
      ok: true,
      token,
      user: {
        id: String(user._id),
        accountType,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organizationName: user.organizationName,
        phone: user.phone,
      },
    });
  } catch (err) {
    if (err?.code === 11000) {
      const fields = Object.keys(err?.keyPattern ?? {});
      return res
        .status(409)
        .json({ ok: false, error: `Already exists: ${fields.join(", ") || "record"}.` });
    }
    return res.status(500).json({ ok: false, error: String(err?.message ?? err) });
  }
});

app.post("/auth/login", requireDb, async (req, res) => {
  try {
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "");
    if (!email) return res.status(400).json({ ok: false, error: "Email is required." });
    if (!password) return res.status(400).json({ ok: false, error: "Password is required." });

    let accountType = null;
    let user = await Volunteer.findOne({ email }).lean();
    if (user) accountType = "volunteer";
    if (!user) {
      user = await Organization.findOne({ email }).lean();
      if (user) accountType = "organization";
    }
    if (!user || !accountType) return res.status(401).json({ ok: false, error: "Invalid email or password." });

    const okPassword = await bcrypt.compare(password, user.password);
    if (!okPassword) return res.status(401).json({ ok: false, error: "Invalid email or password." });

    const token = signAuthToken({
      sub: String(user._id),
      accountType,
      email: user.email,
    });

    return res.json({
      ok: true,
      token,
      user: {
        id: String(user._id),
        accountType,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organizationName: user.organizationName,
        phone: user.phone,
      },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message ?? err) });
  }
});

app.get("/auth/me", authRequired, requireDb, async (req, res) => {
  try {
    const { sub, accountType } = req.user || {};
    if (!sub || !accountType) return res.status(401).json({ ok: false, error: "Invalid token." });

    const Model = accountType === "organization" ? Organization : Volunteer;
    const user = await Model.findById(sub).lean();
    if (!user) return res.status(404).json({ ok: false, error: "User not found." });

    return res.json({
      ok: true,
      user: {
        id: String(user._id),
        accountType,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organizationName: user.organizationName,
        phone: user.phone,
      },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message ?? err) });
  }
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

async function start() {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});