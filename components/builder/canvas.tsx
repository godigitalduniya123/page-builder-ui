"use client"

import { useDroppable } from "@dnd-kit/core"
import { useBuilderStore } from "@/lib/builder-store"
import { CanvasElement } from "./canvas-element"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./canvas-constants"

export function Canvas() {
  const elements = useBuilderStore((s) => s.elements)
  const selectElement = useBuilderStore((s) => s.selectElement)
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" })

  return (
    <main className="flex-1 overflow-auto bg-muted/40 p-10">
      <div className="flex min-h-full min-w-min items-start justify-center">
        <div
          id="builder-canvas"
          ref={setNodeRef}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) selectElement(null)
          }}
          className="relative shrink-0 overflow-hidden rounded-lg bg-background shadow-xl ring-1 ring-border"
          style={{
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            backgroundImage:
              "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            outline: isOver ? "2px solid var(--color-primary)" : undefined,
            outlineOffset: -2,
          }}
        >
          {elements.map((el) => (
            <CanvasElement key={el.id} element={el} />
          ))}
        </div>
      </div>
    </main>
  )
}
