"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ScreenshotPreviewProps {
  screenshot: string | null
  colors: {
    primary: string
    secondary?: string
    accent?: string
    background?: string
    text?: string
  }
}

export default function ScreenshotPreview({ screenshot, colors }: ScreenshotPreviewProps) {
  const [activeTab, setActiveTab] = useState("screenshot")

  if (!screenshot) {
    return null
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Website Analysis</CardTitle>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
        <TabsList className="mb-2">
          <TabsTrigger value="screenshot">Screenshot</TabsTrigger>
          <TabsTrigger value="colors">Extracted Colors</TabsTrigger>
        </TabsList>
        <TabsContent value="screenshot" className="mt-0">
          <CardContent className="p-0 overflow-hidden rounded-md">
            <div className="relative aspect-video max-h-[400px] overflow-hidden">
              <Image
                src={screenshot || "/placeholder.svg"}
                alt="Website Screenshot"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </CardContent>
        </TabsContent>
        <TabsContent value="colors" className="mt-0">
          <CardContent className="py-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(colors).map(([name, color]) => (
                <div key={name} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-md shadow-sm mb-2 border" style={{ backgroundColor: color }} />
                  <div className="text-sm font-medium capitalize">{name}</div>
                  <div className="text-xs text-muted-foreground">{color}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
