import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateGraduationWish = async (
  tone: string,
  language: Language
): Promise<string> => {
  const langName =
    language === Language.ZH_CN
      ? "Simplified Chinese"
      : language === Language.ZH_TW
      ? "Traditional Chinese"
      : "English";

  const prompt = `Write a short, heartwarming graduation message/wish (max 50 words) for a high school yearbook or guestbook. 
  Tone: ${tone || "Sincere and nostalgic"}. 
  Language: ${langName}.
  Return ONLY the message text, no explanations.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    return response.text || "Best wishes on your graduation!";
  } catch (error) {
    console.error("Error generating wish:", error);
    return "Happy Graduation! (AI generation failed, please try again)";
  }
};