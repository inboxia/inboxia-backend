const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// route racine (IMPORTANT)
app.get("/", (req, res) => {
  res.send("Inboxia backend is running 🚀");
});

// health check
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// analyze (GET)
app.get("/analyze", (req, res) => {
  res.json({
    ok: true,
    message: "Use POST /analyze with JSON body { text: '...' }"
  });
});

// analyze (POST)
app.post("/analyze", (req, res) => {
  const { text } = req.body || {};

  if (!text) {
    return res.status(400).json({
      ok: false,
      error: "Missing text"
    });
  }

  res.json({
    ok: true,
    summary: text.slice(0, 140),
    length: text.length
  });
});

// ⚠️ RAILWAY ONLY
const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Inboxia backend running on port", PORT);
});
