import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.json({
    message: "Smart Doubt Solver Backend is running!",
  });
});

app.post("/api/solve", async (req, res) => {
  try {
    const { question, subject } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        error: "Question is required",
      });
    }

    const prompt = `
You are an AI tutor for students.

Subject: ${subject || "General"}

Student Question:
${question}

Explain the answer clearly using simple student-friendly language.

Use:
- Clear headings
- Bullet points where useful
- Examples where useful
- Simple explanations

Do not use unnecessary complicated language.
`;

    console.log("Generating answer for:", question);

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const answer = response.text;

    console.log("Answer generated successfully.");

    res.json({
      answer,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      error: "Failed to generate answer",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});