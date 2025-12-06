import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const getOracleWisdom = async (userBalance: number): Promise<string> => {
  try {
    const ai = getClient();
    
    const prompt = `
      You are the "Star Oracle", a mystical AI entity in a futuristic sci-fi crypto clicker game.
      The user has ${userBalance} coins.
      Give them a short, cryptic, but encouraging piece of wisdom about wealth, patience, or the future.
      Keep it under 30 words.
      Do not be generic. Be mystical and sci-fi themed.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "The stars are silent today. Try again later.";
  } catch (error) {
    console.error("Oracle Error:", error);
    return "Interference detected. The Oracle cannot speak right now.";
  }
};
