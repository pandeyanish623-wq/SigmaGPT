import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getGeminiResponse = async (message) => {
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: message,
    });
    return response.text;
};

export default getGeminiResponse;
