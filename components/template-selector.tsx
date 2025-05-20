"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface TemplateSelectorProps {
  value: string
  onChange: (value: string) => void
}

const templates = [
  {
    id: "standard",
    name: "Standard",
    description: "A classic layout with header, content, and footer",
  },
  {
    id: "modern",
    name: "Modern",
    description: "A contemporary design with bold elements",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "A clean, minimalist approach with focus on content",
  },
  {
    id: "business",
    name: "Business",
    description: "Professional layout ideal for corporate sites",
  },
]

export default function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <RadioGroup value={value} onValueChange={onChange}>
      <div className="space-y-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-accent ${
              value === template.id ? "border-primary" : ""
            }`}
            onClick={() => onChange(template.id)}
          >
            <RadioGroupItem value={template.id} id={template.id} className="mt-1" />
            <div className="space-y-1">
              <Label htmlFor={template.id} className="font-medium cursor-pointer">
                {template.name}
              </Label>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </div>
          </div>
        ))}
      </div>
    </RadioGroup>
  )
}
