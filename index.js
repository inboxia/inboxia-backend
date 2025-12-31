import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.json({ status: "Inboxia backend running" });
});

app.post("/analyze", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a sales assistant. Analyze the message and return JSON with isInterested, summary, proposedQuote, nextAction."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const result = completion.choices[0].message.content;
    res.json({ result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Inboxia backend running on port", PORT);
});
