"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Monitor, Smartphone, Tablet } from "lucide-react"

interface SitePreviewProps {
  siteConfig: {
    colors: {
      primary: string
      secondary?: string
      accent?: string
      background?: string
      text?: string
    }
    typography: {
      headingFont: string
      bodyFont: string
      baseSize?: number
    }
    content: Array<{
      type: string
      content: string
    }>
    layout: string
  }
}

export default function SitePreview({ siteConfig }: SitePreviewProps) {
  const [viewMode, setViewMode] = useState("desktop")

  const getPreviewWidth = () => {
    switch (viewMode) {
      case "mobile":
        return "w-full max-w-[375px]"
      case "tablet":
        return "w-full max-w-[768px]"
      case "desktop":
      default:
        return "w-full"
    }
  }

  // Generate CSS variables for the preview
  const previewStyle = {
    "--color-primary": siteConfig.colors.primary,
    "--color-secondary": siteConfig.colors.secondary || "#10b981",
    "--color-accent": siteConfig.colors.accent || "#8b5cf6",
    "--color-background": siteConfig.colors.background || "#ffffff",
    "--color-text": siteConfig.colors.text || "#1f2937",
    "--font-heading": siteConfig.typography.headingFont,
    "--font-body": siteConfig.typography.bodyFont,
    "--font-size-base": `${siteConfig.typography.baseSize || 16}px`,
  } as React.CSSProperties

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      <div className="border-b p-2 flex justify-between items-center">
        <h3 className="font-medium">Preview</h3>
        <Tabs value={viewMode} onValueChange={setViewMode}>
          <TabsList>
            <TabsTrigger value="mobile">
              <Smartphone className="h-4 w-4" />
              <span className="sr-only">Mobile</span>
            </TabsTrigger>
            <TabsTrigger value="tablet">
              <Tablet className="h-4 w-4" />
              <span className="sr-only">Tablet</span>
            </TabsTrigger>
            <TabsTrigger value="desktop">
              <Monitor className="h-4 w-4" />
              <span className="sr-only">Desktop</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="p-4 flex justify-center overflow-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
        <div className={`${getPreviewWidth()} border rounded shadow-sm`}>
          <div className="p-4" style={previewStyle}>
            {/* Render the preview based on the layout and content */}
            <div
              className="preview-header"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "#fff",
                padding: "1rem",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "calc(var(--font-size-base) * 1.5)",
                  fontWeight: "bold",
                }}
              >
                Site Name
              </div>
              <div
                className="preview-nav"
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "0.5rem",
                  fontFamily: "var(--font-body)",
                }}
              >
                <div>Home</div>
                <div>About</div>
                <div>Services</div>
                <div>Contact</div>
              </div>
            </div>

            <div
              className="preview-content"
              style={{
                padding: "1rem",
                fontFamily: "var(--font-body)",
                fontSize: "var(--font-size-base)",
                color: "var(--color-text)",
                backgroundColor: "var(--color-background)",
              }}
            >
              {siteConfig.content.map((item, index) => {
                switch (item.type) {
                  case "h1":
                    return (
                      <h1
                        key={index}
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "calc(var(--font-size-base) * 2)",
                          fontWeight: "bold",
                          marginBottom: "1rem",
                          color: "var(--color-primary)",
                        }}
                      >
                        {item.content}
                      </h1>
                    )
                  case "h2":
                    return (
                      <h2
                        key={index}
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "calc(var(--font-size-base) * 1.5)",
                          fontWeight: "bold",
                          marginBottom: "0.75rem",
                          marginTop: "1.5rem",
                          color: "var(--color-secondary)",
                        }}
                      >
                        {item.content}
                      </h2>
                    )
                  case "h3":
                    return (
                      <h3
                        key={index}
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "calc(var(--font-size-base) * 1.25)",
                          fontWeight: "bold",
                          marginBottom: "0.5rem",
                          marginTop: "1rem",
                        }}
                      >
                        {item.content}
                      </h3>
                    )
                  case "p":
                  default:
                    return (
                      <p
                        key={index}
                        style={{
                          marginBottom: "1rem",
                        }}
                      >
                        {item.content}
                      </p>
                    )
                }
              })}

              <div
                style={{
                  marginTop: "2rem",
                  padding: "1rem",
                  backgroundColor: "var(--color-accent)",
                  color: "#fff",
                  borderRadius: "0.25rem",
                  textAlign: "center",
                }}
              >
                Call to action button
              </div>
            </div>

            <div
              className="preview-footer"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "#fff",
                padding: "1rem",
                marginTop: "2rem",
                textAlign: "center",
                fontFamily: "var(--font-body)",
                fontSize: "calc(var(--font-size-base) * 0.875)",
              }}
            >
              © 2023 Site Name. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
