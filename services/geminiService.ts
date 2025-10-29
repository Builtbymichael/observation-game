
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getSuggestedQuestion = async (): Promise<string> => {
  if (!API_KEY) {
    return "What was the most interesting color you saw today?";
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a simple, specific, open-ended observation question that someone could ask themselves about their day. The question should be something they can recall the specific answer to the next day. The goal is to improve memory. Examples: 'What was the title of the first article I read today?' or 'What specific food did I have for lunch?'. Provide just one question.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: {
              type: Type.STRING,
              description: 'The suggested observation question.'
            }
          }
        }
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result.question;

  } catch (error) {
    console.error("Error fetching question from Gemini:", error);
    return "What was the most unexpected thing that happened today?";
  }
};
