import { NextResponse } from "next/server"
import { GoogleGenAI, Type } from "@google/genai"

export async function GET() {
  const API_KEY = process.env.GEMINI_API_KEY

  if (!API_KEY) {
    return NextResponse.json({ question: "What was the most interesting color you saw today?" }, { status: 200 })
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY })

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a simple, specific, open-ended observation question that someone could ask themselves about their day. The question should be something they can recall the specific answer to the next day. The goal is to improve memory. Examples: 'What was the title of the first article I read today?' or 'What specific food did I have for lunch?'. Provide just one question.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: {
              type: Type.STRING,
              description: "The suggested observation question.",
            },
          },
        },
      },
    })

    const jsonText = response.text.trim()
    const result = JSON.parse(jsonText)
    return NextResponse.json({ question: result.question })
  } catch (error) {
    console.error("Error fetching question from Gemini:", error)
    return NextResponse.json({ question: "What was the most unexpected thing that happened today?" }, { status: 200 })
  }
}
