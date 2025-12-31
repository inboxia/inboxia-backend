const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ test
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// ✅ page racine (optionnel)
app.get("/", (req, res) => {
  res.send("Inboxia backend is running");
});

// ✅ route que Base44 va appeler
app.post("/analyze", (req, res) => {
  const { text } = req.body || {};

  if (!text || typeof text !== "string") {
    return res.status(400).json({ ok: false, error: "Missing 'text' (string)" });
  }

  // version simple (sans IA pour l’instant)
  const summary = text.length > 140 ? text.slice(0, 140) + "..." : text;

  res.json({
    ok: true,
    receivedChars: text.length,
    summary,
    tips: [
      "Réponds vite (idéal < 5 min).",
      "Propose une action claire (appel / devis / créneau).",
      "Pose 1 question max pour avancer."
    ]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Inboxia backend running on port", PORT));
