"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, Pipette } from "lucide-react"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  label?: string
}

export default function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(color)

  // Update input value when color prop changes
  useEffect(() => {
    setInputValue(color)
  }, [color])

  // Handle input change and validate hex color
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    // Only update parent if it's a valid hex color
    if (/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
      onChange(value)
    }
  }

  // Handle color picker change
  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    onChange(value)
  }

  // Apply color when popover closes
  const handleOpenChange = (open: boolean) => {
    if (!open && /^#([0-9A-F]{3}){1,2}$/i.test(inputValue)) {
      onChange(inputValue)
    }
  }

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={`color-${label}`}>{label}</Label>}
      <div className="flex">
        <Popover onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-10 h-10 p-0 rounded-l-md border border-r-0"
              style={{ backgroundColor: color }}
              aria-label="Pick color"
            >
              <Pipette className="h-4 w-4 text-white mix-blend-difference" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="start">
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <div
                  className="w-full h-24 rounded-md border"
                  style={{ backgroundColor: inputValue }}
                  aria-label="Color preview"
                />
                <input
                  type="color"
                  value={inputValue}
                  onChange={handleColorPickerChange}
                  className="w-full h-8"
                  id={`color-picker-${label}`}
                />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id={`color-${label}`}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="h-8"
                  placeholder="#000000"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 px-2"
                  onClick={() => onChange(inputValue)}
                  disabled={!/^#([0-9A-F]{3}){1,2}$/i.test(inputValue)}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Input
          id={`color-input-${label}`}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="rounded-l-none"
          placeholder="#000000"
        />
      </div>
    </div>
  )
}
