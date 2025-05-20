"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const router = useRouter()

  async function handleAnalyze() {
    if (!url) return

    setIsAnalyzing(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a mock config ID
      const mockConfigId = "mock-" + Math.random().toString(36).substring(2, 9)

      // Navigate to results page with the URL and configId
      router.push(`/results?configId=${mockConfigId}&url=${encodeURIComponent(url)}`)
    } catch (error) {
      console.error("Analysis failed:", error)
      // In a real implementation, we would show an error message
      alert("Analysis failed. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Website to SiteConfig Converter</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Enter a website URL to extract design elements and generate a customizable template
        </p>

        <div className="max-w-2xl mx-auto">
          <div className="flex gap-4 flex-col sm:flex-row">
            <Input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAnalyze} disabled={!url || isAnalyzing} className="whitespace-nowrap">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Start Analysis"
              )}
            </Button>
          </div>

          <div className="mt-8 text-left">
            <h2 className="text-2xl font-semibold mb-4">How it works</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="font-bold text-xl mb-2">1. Analyze</div>
                <p className="text-muted-foreground">
                  Enter a URL and our system will analyze the website's design, colors, typography, and content.
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="font-bold text-xl mb-2">2. Customize</div>
                <p className="text-muted-foreground">
                  Modify the extracted elements to create your perfect template with our intuitive editor.
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="font-bold text-xl mb-2">3. Deploy</div>
                <p className="text-muted-foreground">
                  Deploy your new website with one click and manage it through our dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
