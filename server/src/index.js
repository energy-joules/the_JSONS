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
const Participation = require('./models/participation');

const app = express();

// Connect to MongoDB
// Wait for DB before accepting requests that need it.
// (Otherwise auth requests can race the initial connection.)

// Middleware
app.use(
  cors({
    origin: "https://kindbridge-wmjo.onrender.com",
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

function requireAccountType(type) {
  return (req, res, next) => {
    if (req.user?.accountType !== type) {
      return res.status(403).json({ ok: false, error: `Only ${type} accounts can perform this action.` });
    }
    next();
  };
}

app.post('/events', authRequired, requireDb, requireAccountType('organization'), async (req, res) => {
  try {
    const name = String(req.body.name ?? '').trim();
    const description = String(req.body.description ?? '').trim();
    const address = String(req.body.address ?? '').trim();
    const dateRaw = req.body.date;
    const duration = Number(req.body.duration);
    const latitude = Number(req.body.latitude);
    const longitude = Number(req.body.longitude);
    const maxPeopleRaw = req.body.maxPeople;

    if (!name) return res.status(400).json({ ok: false, error: 'Event name is required.' });
    if (!description) return res.status(400).json({ ok: false, error: 'Description is required.' });
    if (!address) return res.status(400).json({ ok: false, error: 'Address is required.' });
    if (!dateRaw) return res.status(400).json({ ok: false, error: 'Date is required.' });
    const date = new Date(dateRaw);
    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({ ok: false, error: 'Invalid date.' });
    }
    if (!Number.isFinite(duration) || duration < 0) {
      return res.status(400).json({ ok: false, error: 'Duration must be a non-negative number.' });
    }
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      return res.status(400).json({ ok: false, error: 'Latitude must be between -90 and 90.' });
    }
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      return res.status(400).json({ ok: false, error: 'Longitude must be between -180 and 180.' });
    }

    let maxPeople;
    if (maxPeopleRaw !== undefined && maxPeopleRaw !== null && maxPeopleRaw !== '') {
      maxPeople = Number(maxPeopleRaw);
      if (!Number.isFinite(maxPeople) || maxPeople < 1) {
        return res.status(400).json({ ok: false, error: 'Max people must be at least 1.' });
      }
    }

    const event = await Event.create({
      organizationID: req.user.sub,
      name,
      description,
      address,
      date,
      duration,
      latitude,
      longitude,
      ...(maxPeople !== undefined ? { maxPeople } : {}),
    });

    return res.json({ ok: true, event });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message ?? err) });
  }
});

app.get('/events/mine', authRequired, requireDb, requireAccountType('organization'), async (req, res) => {
  try {
    const docs = await Event.find({ organizationID: req.user.sub })
      .sort({ date: 1, createdAt: -1 })
      .lean();
    return res.json({ ok: true, events: docs });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message ?? err) });
  }
});

app.post('/participations', authRequired, requireDb, requireAccountType('organization'), async (req, res) => {
  try {
    const volunteerEmail = String(req.body.volunteerEmail ?? '').trim().toLowerCase();
    const eventName = String(req.body.eventName ?? '').trim();
    const completionDateRaw = req.body.completionDate;
    const hoursEarned = Number(req.body.hoursEarned);

    if (!volunteerEmail) return res.status(400).json({ ok: false, error: 'Volunteer email is required.' });
    if (!eventName) return res.status(400).json({ ok: false, error: 'Event name is required.' });
    if (!completionDateRaw) return res.status(400).json({ ok: false, error: 'Completion date is required.' });
    const completionDate = new Date(completionDateRaw);
    if (Number.isNaN(completionDate.getTime())) {
      return res.status(400).json({ ok: false, error: 'Invalid completion date.' });
    }
    if (!Number.isFinite(hoursEarned) || hoursEarned < 0) {
      return res.status(400).json({ ok: false, error: 'Service hours must be a non-negative number.' });
    }

    const volunteer = await Volunteer.findOne({ email: volunteerEmail }).lean();
    if (!volunteer) return res.status(404).json({ ok: false, error: 'Volunteer not found.' });

    const event = await Event.findOne({ organizationID: req.user.sub, name: eventName }).lean();
    if (!event) return res.status(404).json({ ok: false, error: 'Event not found for this organization.' });

    const departureTime = new Date(completionDate.getTime() + hoursEarned * 3600 * 1000);

    const participation = await Participation.create({
      volunteerID: volunteer._id,
      eventID: event._id,
      status: 'completed',
      hoursEarned,
      arrivalTime: completionDate,
      departureTime,
      awaitingConfirmation: false,
    });

    return res.json({ ok: true, participation });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message ?? err) });
  }
});

app.get('/participations/mine', authRequired, requireDb, requireAccountType('volunteer'), async (req, res) => {
  try {
    const docs = await Participation.find({ volunteerID: req.user.sub })
      .sort({ arrivalTime: -1 })
      .populate('eventID', 'name date')
      .lean();
    return res.json({ ok: true, participations: docs });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message ?? err) });
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