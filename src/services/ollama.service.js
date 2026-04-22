import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});



// ================= MOCK =================
const mockReplies = () => {
  return "Mock: Gemini not working yet.";
};

// ================= PROMPT =================
const buildTeacherPrompt = (prompt) => {
  return `
You are a senior system design teacher.

Explain clearly and structured:

1. Concept
2. Real-world example
3. Key points
4. Analogy
5. When to use

Topic:
${prompt}
`;
};

// ================= GEMINI =================
const generateFromGemini = async (prompt) => {
  console.log("prompt:", prompt);
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", 
    contents: buildTeacherPrompt(prompt),
  });
  console.log("AI TEXT:", response.text);
  return response.text;
};

// ================= OLLAMA =================
const generateFromOllama = async (prompt) => {
  const res = await axios.post(
    "http://localhost:11434/api/generate",
    {
      model: "llama3",
      prompt,
      stream: false,
    }
  );

  return res.data.response;
};

// ================= MAIN =================
export const generateResponse = async (prompt) => {
  try {
    if (process.env.USE_GEMINI === "true") {
      return await generateFromGemini(prompt);
    }

    return await generateFromOllama(prompt);

  } catch (err) {
    console.log("⚠️ Gemini failed:", err.message);
    return mockReplies(prompt);
  }
};