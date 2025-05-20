"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define color palette types
type ColorPalette = {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
}

// Predefined color palettes
const colorPalettes: Record<string, ColorPalette[]> = {
  modern: [
    {
      name: "Blue Modern",
      colors: {
        primary: "#2563eb",
        secondary: "#0ea5e9",
        accent: "#8b5cf6",
        background: "#ffffff",
        text: "#1e293b",
      },
    },
    {
      name: "Green Modern",
      colors: {
        primary: "#059669",
        secondary: "#10b981",
        accent: "#6366f1",
        background: "#f8fafc",
        text: "#334155",
      },
    },
    {
      name: "Purple Modern",
      colors: {
        primary: "#7c3aed",
        secondary: "#a855f7",
        accent: "#ec4899",
        background: "#ffffff",
        text: "#1e293b",
      },
    },
  ],
  minimal: [
    {
      name: "Grayscale",
      colors: {
        primary: "#262626",
        secondary: "#525252",
        accent: "#737373",
        background: "#fafafa",
        text: "#171717",
      },
    },
    {
      name: "Soft Minimal",
      colors: {
        primary: "#6b7280",
        secondary: "#9ca3af",
        accent: "#d1d5db",
        background: "#ffffff",
        text: "#111827",
      },
    },
    {
      name: "Warm Minimal",
      colors: {
        primary: "#78350f",
        secondary: "#92400e",
        accent: "#b45309",
        background: "#fffbeb",
        text: "#451a03",
      },
    },
  ],
  vibrant: [
    {
      name: "Sunset",
      colors: {
        primary: "#f97316",
        secondary: "#fb923c",
        accent: "#f43f5e",
        background: "#fffbeb",
        text: "#431407",
      },
    },
    {
      name: "Ocean",
      colors: {
        primary: "#0284c7",
        secondary: "#0ea5e9",
        accent: "#06b6d4",
        background: "#f0f9ff",
        text: "#0c4a6e",
      },
    },
    {
      name: "Forest",
      colors: {
        primary: "#15803d",
        secondary: "#22c55e",
        accent: "#eab308",
        background: "#f0fdf4",
        text: "#14532d",
      },
    },
  ],
  dark: [
    {
      name: "Dark Mode",
      colors: {
        primary: "#3b82f6",
        secondary: "#60a5fa",
        accent: "#a855f7",
        background: "#1e293b",
        text: "#f8fafc",
      },
    },
    {
      name: "Midnight",
      colors: {
        primary: "#8b5cf6",
        secondary: "#a78bfa",
        accent: "#ec4899",
        background: "#0f172a",
        text: "#e2e8f0",
      },
    },
    {
      name: "Dark Elegant",
      colors: {
        primary: "#94a3b8",
        secondary: "#cbd5e1",
        accent: "#f97316",
        background: "#1e293b",
        text: "#f1f5f9",
      },
    },
  ],
}

interface PaletteSuggestionsProps {
  onSelectPalette: (colors: ColorPalette["colors"]) => void
}

export default function PaletteSuggestions({ onSelectPalette }: PaletteSuggestionsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Suggested Palettes</h3>
      <Tabs defaultValue="modern" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="modern">Modern</TabsTrigger>
          <TabsTrigger value="minimal">Minimal</TabsTrigger>
          <TabsTrigger value="vibrant">Vibrant</TabsTrigger>
          <TabsTrigger value="dark">Dark</TabsTrigger>
        </TabsList>
        {Object.entries(colorPalettes).map(([category, palettes]) => (
          <TabsContent key={category} value={category} className="mt-2">
            <ScrollArea className="h-[180px]">
              <div className="space-y-2">
                {palettes.map((palette) => (
                  <div key={palette.name} className="p-3 border rounded-md hover:bg-accent/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{palette.name}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectPalette(palette.colors)}
                        className="h-7 text-xs"
                      >
                        Apply
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      {Object.entries(palette.colors).map(([key, color]) => (
                        <div
                          key={key}
                          className="w-8 h-8 rounded-md border"
                          style={{ backgroundColor: color }}
                          title={`${key}: ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
