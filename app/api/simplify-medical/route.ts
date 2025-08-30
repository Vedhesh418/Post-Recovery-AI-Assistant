import { NextResponse } from "next/server"
import { simplifyMedicalJargon } from "@/lib/gemini"

export async function POST(req: Request) {
  try {
    const { medicalText, language } = await req.json()

    if (!medicalText) {
      return NextResponse.json({ success: false, error: "Medical text is required" }, { status: 400 })
    }

    const result = await simplifyMedicalJargon(medicalText, language)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error("Error simplifying medical text:", error)
    return NextResponse.json({ success: false, error: "Failed to simplify medical text" }, { status: 500 })
  }
}
