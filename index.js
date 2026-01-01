const express = require("express");
const cors = require("cors");
const { ImapFlow } = require("imapflow");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ check
app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/", (req, res) => res.send("Inboxia backend is running 🚀"));

// ✅ TEST CONNEXION GMAIL IMAP
// Body attendu: { "email": "...", "appPassword": "...." }
app.post("/connect/gmail", async (req, res) => {
  const { email, appPassword } = req.body || {};

  if (!email || !appPassword) {
    return res.status(400).json({
      ok: false,
      error: "Missing email or appPassword"
    });
  }

  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user: email,
      pass: appPassword
    }
  });

  try {
    await client.connect();

    // On ouvre la boîte pour confirmer
    const lock = await client.getMailboxLock("INBOX");
    lock.release();

    await client.logout();

    return res.json({ ok: true, message: "Gmail connected ✅" });
  } catch (err) {
    try { await client.logout(); } catch (e) {}

    return res.status(401).json({
      ok: false,
      error: "Gmail connection failed",
      details: err?.message || String(err)
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Inboxia backend running on port", PORT));
