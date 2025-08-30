import { NextResponse } from "next/server"
import { analyzeMedicalReport } from "@/lib/gemini"

export async function POST(req: Request) {
  try {
    const { reportText, language } = await req.json()

    if (!reportText) {
      return NextResponse.json({ success: false, error: "Report text is required" }, { status: 400 })
    }

    const result = await analyzeMedicalReport(reportText, language)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error("Error analyzing report:", error)
    return NextResponse.json({ success: false, error: "Failed to analyze report" }, { status: 500 })
  }
}
