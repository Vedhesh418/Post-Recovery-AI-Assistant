import { NextResponse } from "next/server"
import { analyzeHealthProfile } from "@/lib/gemini"

export async function POST(req: Request) {
  try {
    const { profileData, language } = await req.json()

    if (!profileData) {
      return NextResponse.json({ success: false, error: "Profile data is required" }, { status: 400 })
    }

    const result = await analyzeHealthProfile(profileData, language)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error("Error analyzing health profile:", error)
    return NextResponse.json({ success: false, error: "Failed to analyze health profile" }, { status: 500 })
  }
}
