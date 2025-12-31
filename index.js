const express = require("express");
const cors = require("cors");

const app = express();

// ✅ autorise Base44 + tests
app.use(cors());
app.use(express.json());

// 🔐 petite sécurité (facultatif mais recommandé)
// Mets une variable Railway: API_KEY = "untrucsecret"
function requireApiKey(req, res, next) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return next(); // si pas de clé configurée, on laisse passer
  const sent = req.headers["x-api-key"];
  if (sent !== apiKey) {
    return res.status(401).json({ error: "Unauthorized (missing/invalid x-api-key)" });
  }
  next();
}

// ✅ route racine (pour éviter Cannot GET /)
app.get("/", (req, res) => {
  res.send("Inboxia backend is running 🚀");
});

// ✅ health check
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// ✅ route test (GET)
app.get("/ping", requireApiKey, (req, res) => {
  res.json({ ok: true, message: "pong", time: new Date().toISOString() });
});

// ✅ route test (POST) — parfait pour Base44
// Body attendu: { "text": "..." }
app.post("/analyze", requireApiKey, (req, res) => {
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: "Missing 'text' in body" });

  // Exemple de "mini IA" pour l’instant (placeholder)
  const summary = text.length > 160 ? text.slice(0, 160) + "..." : text;

  res.json({
    ok: true,
    receivedChars: text.length,
    summary,
    tips: [
      "Réponds en moins de 5 minutes si possible",
      "Propose un créneau ou une action claire",
      "Pose 1 question max pour avancer",
    ],
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Inboxia backend running on port", PORT);
});
