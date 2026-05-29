import { GoogleGenAI } from "@google/genai";

// Initialize the SDK. 
// Note: In Next.js Server Actions, process.env is available automatically.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Use gemini-2.5-flash as the default for fast, conversational responses
const DEFAULT_MODEL = "gemini-2.5-flash";

export interface GenerateOptions {
  systemInstruction?: string;
  temperature?: number;
}

/**
 * Standard text generation (Conversations, Chat)
 */
export async function generateText(
  prompt: string,
  options?: GenerateOptions
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in the environment variables.");
  }

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        systemInstruction: options?.systemInstruction,
        temperature: options?.temperature ?? 0.7,
      },
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate AI response.");
  }
}

/**
 * Structured JSON generation (Reframing, Analysis, Extracting data)
 */
export async function generateJson<T>(
  prompt: string,
  options?: GenerateOptions
): Promise<T> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in the environment variables.");
  }

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        systemInstruction: options?.systemInstruction,
        temperature: options?.temperature ?? 0.2, // Lower temp for more deterministic JSON
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text) as T;
  } catch (error) {
    console.error("Gemini API Error (JSON):", error);
    throw new Error("Failed to generate structured AI response.");
  }
}
