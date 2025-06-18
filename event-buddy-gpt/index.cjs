const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.post("/generate", async (req, res) => {
  const { name, title, skills, achievements } = req.body;

  const prompt = `Generate a short professional intro for ${name}, a ${title}, skilled in ${skills}, who achieved: ${achievements}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173", // your frontend dev URL
        "X-Title": "EventBuddy-MCP"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an AI assistant that writes short 3-line intros from a user's MCP JSON." },
          { role: "user", content: prompt }
        ]
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.json({ output: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: "No response from OpenRouter" });
    }
  } catch (err) {
    console.error("OpenRouter Error:", err);
    res.status(500).json({ error: "Failed to connect to OpenRouter" });
  }
});

app.listen(3000, () => {
  console.log("✅ Event Buddy (OpenRouter) API running at http://localhost:3000");
});
