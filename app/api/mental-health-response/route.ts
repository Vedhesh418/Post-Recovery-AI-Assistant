import { NextResponse } from "next/server"
import { generateMentalHealthResponse } from "@/lib/gemini"

export async function POST(req: Request) {
  try {
    const { mood, context, language } = await req.json()

    if (!mood) {
      return NextResponse.json({ success: false, error: "Mood is required" }, { status: 400 })
    }

    const result = await generateMentalHealthResponse(mood, context, language)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error("Error generating mental health response:", error)
    return NextResponse.json({ success: false, error: "Failed to generate response" }, { status: 500 })
  }
}
