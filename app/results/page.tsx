"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import SitePreview from "@/components/site-preview"
import ColorEditor from "@/components/color-editor"
import TypographyEditor from "@/components/typography-editor"
import TemplateSelector from "@/components/template-selector"
import ContentEditor from "@/components/content-editor"
import ScreenshotPreview from "@/components/screenshot-preview"

// Mock data for the site config
const initialSiteConfig = {
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

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const configId = searchParams.get("configId")
  const [siteConfig, setSiteConfig] = useState(initialSiteConfig)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("design")
  const [isDeploying, setIsDeploying] = useState(false)

  useEffect(() => {
    // Simulate loading data from the backend
    const timer = setTimeout(() => {
      // Update the site config with the URL from the query params if available
      const url = searchParams.get("url")
      if (url) {
        setSiteConfig((prev) => ({
          ...prev,
          sourceUrl: url,
          name: url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
        }))
      }
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [searchParams, configId])

  const handleUpdateColors = (colors) => {
    setSiteConfig((prev) => ({
      ...prev,
      colors,
    }))
    toast.success("Color palette updated")
  }

  const handleUpdateTypography = (typography) => {
    setSiteConfig((prev) => ({
      ...prev,
      typography,
    }))
  }

  const handleUpdateLayout = (layout) => {
    setSiteConfig((prev) => ({
      ...prev,
      layout,
    }))
  }

  const handleUpdateContent = (content) => {
    setSiteConfig((prev) => ({
      ...prev,
      content,
    }))
  }

  const handleDeploy = async () => {
    setIsDeploying(true)
    // Simulate deployment process
    setTimeout(() => {
      setIsDeploying(false)
      // Show success message
      toast.success("Site deployed successfully!", {
        description: "Your site is now live and accessible.",
      })
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading site configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Site Generator</h1>
        <Button onClick={handleDeploy} disabled={isDeploying}>
          {isDeploying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deploying...
            </>
          ) : (
            "Deploy Website"
          )}
        </Button>
      </div>

      {/* Add the screenshot preview component */}
      <ScreenshotPreview screenshot={siteConfig.screenshot} colors={siteConfig.colors} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="design" className="flex-1">
                Design
              </TabsTrigger>
              <TabsTrigger value="content" className="flex-1">
                Content
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="design">
              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Colors</h3>
                  <ColorEditor colors={siteConfig.colors} onChange={handleUpdateColors} />
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Typography</h3>
                  <TypographyEditor typography={siteConfig.typography} onChange={handleUpdateTypography} />
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Template</h3>
                  <TemplateSelector value={siteConfig.layout} onChange={handleUpdateLayout} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content">
              <ContentEditor content={siteConfig.content} onChange={handleUpdateContent} />
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-4 mt-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Site Information</h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>Source URL:</strong> {siteConfig.sourceUrl}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Created:</strong> {new Date(siteConfig.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Status:</strong> {siteConfig.status}
                  </p>
                </div>

                {/* Additional settings would go here */}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-8">
          <SitePreview siteConfig={siteConfig} />
        </div>
      </div>
    </div>
  )
}
