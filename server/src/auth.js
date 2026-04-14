const jwt = require("jsonwebtoken");

function getJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error("JWT_SECRET is not set.");
  }
  return secret;
}

function signAuthToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

function parseBearerToken(req) {
  const header = req.headers.authorization;
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

function authRequired(req, res, next) {
  try {
    const token = parseBearerToken(req);
    if (!token) return res.status(401).json({ ok: false, error: "Missing token." });
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: "Invalid or expired token." });
  }
}

module.exports = {
  signAuthToken,
  authRequired,
};

