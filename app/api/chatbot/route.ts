import { NextResponse } from "next/server"
import { generateGeminiResponse } from "@/lib/gemini"

export async function POST(req: Request) {
  try {
    const { userInput, language } = await req.json()

    if (!userInput) {
      return NextResponse.json({ success: false, error: "User input is required" }, { status: 400 })
    }

    const systemPrompt = `You are an empathetic medical chatbot.Mention how your advice is not as good as a doctor and to consult a doctor for best diagnosis. Provide supportive, kind responses to help users with their symptoms or feelings. Respond in ${language}.`

    const prompt = `User: ${userInput}\n\nPlease provide a supportive, empathetic response and any relevant advice.`

    const result = await generateGeminiResponse(prompt, systemPrompt)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error("Error generating chatbot response:", error)
    return NextResponse.json({ success: false, error: "Failed to generate response" }, { status: 500 })
  }
} 