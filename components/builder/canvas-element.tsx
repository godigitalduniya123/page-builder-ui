"use client"

import { Rnd } from "react-rnd"
import { Copy, Trash2 } from "lucide-react"
import { type CanvasElementData, ELEMENT_LABELS } from "@/lib/builder-types"
import { useBuilderStore } from "@/lib/builder-store"
import { ElementContent } from "./element-content"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./canvas-constants"
import { cn } from "@/lib/utils"

export function CanvasElement({ element }: { element: CanvasElementData }) {
  const selectedId = useBuilderStore((s) => s.selectedId)
  const selectElement = useBuilderStore((s) => s.selectElement)
  const updateElement = useBuilderStore((s) => s.updateElement)
  const deleteElement = useBuilderStore((s) => s.deleteElement)
  const duplicateElement = useBuilderStore((s) => s.duplicateElement)

  const selected = selectedId === element.id
  const { style } = element

  return (
    <Rnd
      size={{ width: element.width, height: element.height }}
      position={{ x: element.x, y: element.y }}
      bounds="parent"
      minWidth={60}
      minHeight={32}
      enableResizing={selected}
      onDragStart={() => selectElement(element.id)}
      onDragStop={(_, d) => updateElement(element.id, { x: Math.round(d.x), y: Math.round(d.y) })}
      onResizeStop={(_, __, ref, ___, pos) =>
        updateElement(element.id, {
          width: Math.round(ref.offsetWidth),
          height: Math.round(ref.offsetHeight),
          x: Math.round(pos.x),
          y: Math.round(pos.y),
        })
      }
      style={{ zIndex: selected ? 20 : 1 }}
      className="group"
    >
      {/* Floating toolbar */}
      {selected && (
        <div className="absolute -top-9 right-0 flex items-center gap-1 rounded-md border border-border bg-card p-0.5 shadow-sm">
          <button
            onClick={(e) => {
              e.stopPropagation()
              duplicateElement(element.id)
            }}
            className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Duplicate element"
          >
            <Copy className="size-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              deleteElement(element.id)
            }}
            className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label="Delete element"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      )}

      {/* Type tag */}
      {selected && (
        <div className="absolute -top-5 left-0 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
          {ELEMENT_LABELS[element.type]}
        </div>
      )}

      <div
        onMouseDown={() => selectElement(element.id)}
        className={cn(
          "flex h-full w-full overflow-hidden ring-offset-0",
          selected ? "ring-2 ring-primary" : "ring-1 ring-transparent hover:ring-border",
        )}
        style={{
          backgroundColor: style.backgroundColor,
          color: style.textColor,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          borderRadius: style.borderRadius,
          borderWidth: style.borderWidth,
          borderColor: style.borderColor,
          borderStyle: "solid",
          padding: style.padding,
          opacity: style.opacity / 100,
        }}
      >
        <ElementContent element={element} />
      </div>
    </Rnd>
  )
}

export { CANVAS_WIDTH, CANVAS_HEIGHT }
