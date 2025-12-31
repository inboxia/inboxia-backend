import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Test route (pour vérifier que le backend marche)
app.get("/", (req, res) => {
  res.json({ status: "Inboxia backend running ✅" });
});

// ✅ Route utilisée par Base44 / Agent
app.post("/analyze", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message manquant" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Tu es un agent IA qui analyse les messages entrants et détecte l’intention du client.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      analysis: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur IA" });
  }
});

// ✅ Port Railway ou local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Inboxia backend running on port ${PORT}`);
});
