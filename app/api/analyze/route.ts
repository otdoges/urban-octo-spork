import { NextResponse } from "next/server"

// Mock data for the site config
const mockSiteConfig = {
  id: "mock-id",
  sourceUrl: "https://example.com",
  name: "Example Site",
  createdAt: Date.now(),
  colors: {
    primary: "#3b82f6",
    secondary: "#10b981",
    accent: "#8b5cf6",
    background: "#ffffff",
    text: "#1f2937",
  },
  typography: {
    headingFont: "Inter",
    bodyFont: "Roboto",
    baseSize: 16,
  },
  content: [
    { type: "h1", content: "Welcome to Example Site" },
    { type: "p", content: "This is a sample paragraph extracted from the website." },
    { type: "h2", content: "Our Services" },
    { type: "p", content: "We provide various services to meet your needs." },
  ],
  layout: "standard",
  status: "draft",
  screenshot: "/placeholder.svg?height=600&width=800",
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Generate a random ID for the mock config
    const mockConfigId = "mock-" + Math.random().toString(36).substring(2, 9)

    // Simulate a delay to mimic processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json({
      success: true,
      configId: mockConfigId,
      siteConfig: {
        ...mockSiteConfig,
        sourceUrl: url,
        name: url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      },
    })
  } catch (error) {
    console.error("Error analyzing website:", error)
    return NextResponse.json({ error: "Failed to analyze website" }, { status: 500 })
  }
}
