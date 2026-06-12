"use client"

import { useEffect } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { useState } from "react"
import { useBuilderStore } from "@/lib/builder-store"
import { ELEMENT_LABELS, type ElementType } from "@/lib/builder-types"
import { TopBar } from "./top-bar"
import { ElementPalette } from "./element-palette"
import { Canvas } from "./canvas"
import { PropertiesPanel } from "./properties-panel"
import { defaultSize } from "@/lib/builder-types"

export function PageBuilder() {
  const addElement = useBuilderStore((s) => s.addElement)
  const selectedId = useBuilderStore((s) => s.selectedId)
  const selectElement = useBuilderStore((s) => s.selectElement)
  const deleteElement = useBuilderStore((s) => s.deleteElement)
  const [dragType, setDragType] = useState<ElementType | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const typing =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      if (e.key === "Escape") {
        selectElement(null)
      } else if ((e.key === "Delete" || e.key === "Backspace") && selectedId && !typing) {
        e.preventDefault()
        deleteElement(selectedId)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [selectedId, selectElement, deleteElement])

  function handleDragStart(e: DragStartEvent) {
    const data = e.active.data.current
    if (data?.fromPalette) setDragType(data.type as ElementType)
  }

  function handleDragEnd(e: DragEndEvent) {
    setDragType(null)
    const data = e.active.data.current
    if (!data?.fromPalette || e.over?.id !== "canvas") return

    const type = data.type as ElementType
    const canvasEl = document.getElementById("builder-canvas")
    const rect = canvasEl?.getBoundingClientRect()
    const size = defaultSize(type)

    let x = 40
    let y = 40
    if (rect && e.activatorEvent instanceof PointerEvent) {
      const pointer = e.activatorEvent
      const dropX = pointer.clientX + e.delta.x - rect.left
      const dropY = pointer.clientY + e.delta.y - rect.top
      x = Math.max(0, Math.min(rect.width - size.width, dropX - size.width / 2))
      y = Math.max(0, Math.min(rect.height - size.height, dropY - size.height / 2))
    }
    addElement(type, Math.round(x), Math.round(y))
  }

  return (
    <DndContext
      id="page-builder-dnd"
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <ElementPalette />
          <Canvas />
          <PropertiesPanel />
        </div>
      </div>
      <DragOverlay>
        {dragType ? (
          <div className="flex items-center gap-2 rounded-md border border-primary bg-card px-3 py-2 text-sm shadow-lg">
            {ELEMENT_LABELS[dragType]}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
