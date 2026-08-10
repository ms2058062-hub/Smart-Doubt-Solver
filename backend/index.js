import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

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
    const { question, subject = "General" } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "Question is required",
      });
    }

    const prompt = `
You are Smart Doubt Solver, an AI tutor for students.

Subject: ${subject}

Student Question:
${question}

Give a clear, accurate and easy-to-understand answer.

Rules:
- Explain step by step.
- Use simple language.
- Give examples when useful.
- For mathematics, show calculations clearly.
- For programming questions, provide correct code when needed.
- Do not unnecessarily make the answer complicated.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const answer = response.text;

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

// Local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

export default app;