"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ColorPicker from "./color-picker"
import PaletteSuggestions from "./palette-suggestions"

interface ColorEditorProps {
  colors: {
    primary: string
    secondary?: string
    accent?: string
    background?: string
    text?: string
  }
  onChange: (colors: ColorEditorProps["colors"]) => void
}

export default function ColorEditor({ colors, onChange }: ColorEditorProps) {
  const [activeTab, setActiveTab] = useState("custom")

  const handleColorChange = (key: string, value: string) => {
    onChange({
      ...colors,
      [key]: value,
    })
  }

  return (
    <Card>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="custom">Custom Colors</TabsTrigger>
          <TabsTrigger value="suggestions">Palette Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="custom" className="mt-0">
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPicker
                color={colors.primary || "#3b82f6"}
                onChange={(color) => handleColorChange("primary", color)}
                label="Primary"
              />
              <ColorPicker
                color={colors.secondary || "#10b981"}
                onChange={(color) => handleColorChange("secondary", color)}
                label="Secondary"
              />
              <ColorPicker
                color={colors.accent || "#8b5cf6"}
                onChange={(color) => handleColorChange("accent", color)}
                label="Accent"
              />
              <ColorPicker
                color={colors.background || "#ffffff"}
                onChange={(color) => handleColorChange("background", color)}
                label="Background"
              />
              <ColorPicker
                color={colors.text || "#1f2937"}
                onChange={(color) => handleColorChange("text", color)}
                label="Text"
              />
            </div>

            <div className="p-4 border rounded-md mt-4">
              <div className="text-sm font-medium mb-2">Color Preview</div>
              <div className="flex gap-2 flex-wrap">
                <div
                  className="w-12 h-12 rounded-md shadow-sm"
                  style={{ backgroundColor: colors.primary }}
                  title="Primary"
                />
                <div
                  className="w-12 h-12 rounded-md shadow-sm"
                  style={{ backgroundColor: colors.secondary }}
                  title="Secondary"
                />
                <div
                  className="w-12 h-12 rounded-md shadow-sm"
                  style={{ backgroundColor: colors.accent }}
                  title="Accent"
                />
                <div
                  className="w-12 h-12 rounded-md shadow-sm border"
                  style={{ backgroundColor: colors.background }}
                  title="Background"
                />
                <div className="w-12 h-12 rounded-md shadow-sm" style={{ backgroundColor: colors.text }} title="Text" />
              </div>
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="suggestions" className="mt-0">
          <CardContent className="p-4">
            <PaletteSuggestions onSelectPalette={onChange} />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
