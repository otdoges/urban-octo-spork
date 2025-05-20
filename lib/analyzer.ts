export async function analyzeWebsite(url: string) {
  try {
    // Capture screenshot (mock)
    const screenshotResponse = await fetch("/api/screenshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })

    if (!screenshotResponse.ok) {
      throw new Error("Failed to capture screenshot")
    }

    const screenshotData = await screenshotResponse.json()
    const screenshot = screenshotData.screenshot

    // Extract colors (mock)
    const colorsResponse = await fetch("/api/extract-colors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ screenshot }),
    })

    if (!colorsResponse.ok) {
      throw new Error("Failed to extract colors")
    }

    const colorsData = await colorsResponse.json()
    const colors = colorsData.colors

    // Mock typography and content data
    const typography = {
      headingFont: "Inter",
      bodyFont: "Roboto",
      baseSize: 16,
    }

    const content = [
      { type: "h1", content: "Welcome to " + url.replace(/^https?:\/\//, "").replace(/\/$/, "") },
      { type: "p", content: "This is a sample paragraph extracted from the website." },
      { type: "h2", content: "Our Services" },
      { type: "p", content: "We provide various services to meet your needs." },
    ]

    return {
      sourceUrl: url,
      name: url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      createdAt: Date.now(),
      colors,
      typography,
      content,
      layout: "standard",
      status: "draft",
      screenshot,
    }
  } catch (error) {
    console.error("Error analyzing website:", error)
    // Fallback to default values if analysis fails
    return {
      sourceUrl: url,
      name: url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
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
        { type: "h1", content: "Website Title" },
        { type: "p", content: "This is a placeholder for the website content." },
      ],
      layout: "standard",
      status: "draft",
      screenshot: null,
    }
  }
}
