import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { screenshot } = await request.json()

    if (!screenshot) {
      return NextResponse.json({ error: "Screenshot is required" }, { status: 400 })
    }

    // Simulate a delay to mimic AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Return mock colors instead of using AI
    const colors = {
      primary: "#3b82f6",
      secondary: "#10b981",
      accent: "#8b5cf6",
      background: "#ffffff",
      text: "#1f2937",
    }

    return NextResponse.json({
      success: true,
      colors,
    })
  } catch (error) {
    console.error("Error extracting colors:", error)
    return NextResponse.json({ error: "Failed to extract colors" }, { status: 500 })
  }
}
