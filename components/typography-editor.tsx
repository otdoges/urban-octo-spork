"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface TypographyEditorProps {
  typography: {
    headingFont: string
    bodyFont: string
    baseSize?: number
  }
  onChange: (typography: TypographyEditorProps["typography"]) => void
}

const fontOptions = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Raleway",
  "Source Sans Pro",
  "Playfair Display",
  "Merriweather",
]

export default function TypographyEditor({ typography, onChange }: TypographyEditorProps) {
  const handleChange = (key: string, value: string | number) => {
    onChange({
      ...typography,
      [key]: value,
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="heading-font">Heading Font</Label>
        <Select value={typography.headingFont} onValueChange={(value) => handleChange("headingFont", value)}>
          <SelectTrigger id="heading-font">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((font) => (
              <SelectItem key={font} value={font}>
                <span style={{ fontFamily: font }}>{font}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="body-font">Body Font</Label>
        <Select value={typography.bodyFont} onValueChange={(value) => handleChange("bodyFont", value)}>
          <SelectTrigger id="body-font">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((font) => (
              <SelectItem key={font} value={font}>
                <span style={{ fontFamily: font }}>{font}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="base-size">Base Font Size: {typography.baseSize}px</Label>
        <Slider
          id="base-size"
          min={12}
          max={24}
          step={1}
          value={[typography.baseSize || 16]}
          onValueChange={(value) => handleChange("baseSize", value[0])}
          className="mt-2"
        />
      </div>

      <div className="p-4 border rounded-md space-y-2">
        <div className="text-sm font-medium mb-2">Typography Preview</div>
        <h1
          style={{
            fontFamily: typography.headingFont,
            fontSize: `${(typography.baseSize || 16) * 2}px`,
            fontWeight: "bold",
          }}
        >
          Heading 1
        </h1>
        <h2
          style={{
            fontFamily: typography.headingFont,
            fontSize: `${(typography.baseSize || 16) * 1.5}px`,
            fontWeight: "bold",
          }}
        >
          Heading 2
        </h2>
        <h3
          style={{
            fontFamily: typography.headingFont,
            fontSize: `${(typography.baseSize || 16) * 1.25}px`,
            fontWeight: "bold",
          }}
        >
          Heading 3
        </h3>
        <p
          style={{
            fontFamily: typography.bodyFont,
            fontSize: `${typography.baseSize || 16}px`,
          }}
        >
          This is a paragraph text in the body font. It demonstrates how the body text will look on your website.
        </p>
      </div>
    </div>
  )
}
