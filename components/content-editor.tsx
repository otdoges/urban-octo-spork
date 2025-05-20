"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { GripVertical, Trash2 } from "lucide-react"

interface ContentItem {
  type: string
  content: string
}

interface ContentEditorProps {
  content: ContentItem[]
  onChange: (content: ContentItem[]) => void
}

export default function ContentEditor({ content, onChange }: ContentEditorProps) {
  const [newItemType, setNewItemType] = useState("p")
  const [newItemContent, setNewItemContent] = useState("")

  const handleAddItem = () => {
    if (!newItemContent.trim()) return

    onChange([
      ...content,
      {
        type: newItemType,
        content: newItemContent,
      },
    ])

    setNewItemContent("")
  }

  const handleRemoveItem = (index: number) => {
    const newContent = [...content]
    newContent.splice(index, 1)
    onChange(newContent)
  }

  const handleUpdateItem = (index: number, field: string, value: string) => {
    const newContent = [...content]
    newContent[index] = {
      ...newContent[index],
      [field]: value,
    }
    onChange(newContent)
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(content)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    onChange(items)
  }

  return (
    <div className="space-y-6 mt-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Content Elements</h3>
        <p className="text-sm text-muted-foreground">Drag and drop to reorder content elements</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="content-items">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {content.map((item, index) => (
                <Draggable key={index} draggableId={`item-${index}`} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} className="border rounded-md p-3 bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <div {...provided.dragHandleProps} className="cursor-move">
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <Select value={item.type} onValueChange={(value) => handleUpdateItem(index, "type", value)}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="h1">H1</SelectItem>
                            <SelectItem value="h2">H2</SelectItem>
                            <SelectItem value="h3">H3</SelectItem>
                            <SelectItem value="p">Paragraph</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)} className="ml-auto">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>

                      <Textarea
                        value={item.content}
                        onChange={(e) => handleUpdateItem(index, "content", e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-2">Add New Content</h4>
        <div className="flex gap-2 items-start">
          <Select value={newItemType} onValueChange={setNewItemType}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="h1">H1</SelectItem>
              <SelectItem value="h2">H2</SelectItem>
              <SelectItem value="h3">H3</SelectItem>
              <SelectItem value="p">Paragraph</SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            value={newItemContent}
            onChange={(e) => setNewItemContent(e.target.value)}
            placeholder="Enter content text"
            className="flex-1 min-h-[80px]"
          />

          <Button onClick={handleAddItem} className="mt-1">
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
