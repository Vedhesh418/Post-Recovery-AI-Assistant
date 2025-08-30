import { NextResponse } from "next/server"
import { suggestMedicineAlternatives } from "@/lib/gemini"

export async function POST(req: Request) {
  try {
    const { medicineName, language } = await req.json()

    if (!medicineName) {
      return NextResponse.json({ success: false, error: "Medicine name is required" }, { status: 400 })
    }

    const result = await suggestMedicineAlternatives(medicineName, language)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error("Error suggesting alternatives:", error)
    return NextResponse.json({ success: false, error: "Failed to suggest alternatives" }, { status: 500 })
  }
}
