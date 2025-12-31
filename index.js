const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// --------------------
// ROUTES DE TEST
// --------------------

// route racine (évite "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Inboxia backend is running 🚀");
});

// health check
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// --------------------
// ROUTE ANALYZE
// --------------------

// GET pour tester dans le navigateur
app.get("/analyze", (req, res) => {
  res.json({
    ok: true,
    message: "Utilise POST /analyze avec un body JSON { text: '...' }"
  });
});

// POST pour Base44 / vraie utilisation
app.post("/analyze", (req, res) => {
  const { text } = req.body || {};

  if (!text || typeof text !== "string") {
    return res.status(400).json({
      ok: false,
      error: "Missing 'text' (string) in body"
    });
  }

  // logique simple (placeholder)
  const summary =
    text.length > 140 ? text.slice(0, 140) + "..." : text;

  res
