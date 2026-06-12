"use client"

import { useState } from "react"
import { useDraggable } from "@dnd-kit/core"
import {
  Type,
  Heading,
  TextCursorInput,
  AlignLeft,
  MousePointerClick,
  CircleDot,
  CheckSquare,
  ChevronDownSquare,
  Gauge,
  LineChart,
  BarChart3,
  CircleDashed,
  Table,
  Hash,
  ChevronRight,
  type LucideIcon,
} from "lucide-react"
import { type ElementType, ELEMENT_LABELS } from "@/lib/builder-types"
import { cn } from "@/lib/utils"

const ICONS: Record<ElementType, LucideIcon> = {
  text: Type,
  heading: Heading,
  input: TextCursorInput,
  textarea: AlignLeft,
  button: MousePointerClick,
  radio: CircleDot,
  checkbox: CheckSquare,
  select: ChevronDownSquare,
  "value-card": Hash,
  gauge: Gauge,
  "line-chart": LineChart,
  "bar-chart": BarChart3,
  status: CircleDashed,
  table: Table,
}

const FORM_ITEMS: ElementType[] = [
  "text",
  "heading",
  "input",
  "textarea",
  "button",
  "radio",
  "checkbox",
  "select",
]
const WIDGET_ITEMS: ElementType[] = [
  "value-card",
  "gauge",
  "line-chart",
  "bar-chart",
  "status",
  "table",
]

function PaletteItem({ type }: { type: ElementType }) {
  const Icon = ICONS[type]
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { fromPalette: true, type },
  })
  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex cursor-grab items-center gap-2 rounded-md border border-border bg-card px-2.5 py-2 text-left text-sm transition-colors hover:border-primary/40 hover:bg-accent active:cursor-grabbing",
        isDragging && "opacity-40",
      )}
    >
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span className="truncate">{ELEMENT_LABELS[type]}</span>
    </button>
  )
}

function Section({
  title,
  items,
}: {
  title: string
  items: ElementType[]
}) {
  const [open, setOpen] = useState(true)
  return (
    <div className="flex flex-col">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-1 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
      >
        <ChevronRight
          className={cn("size-3.5 transition-transform", open && "rotate-90")}
        />
        {title}
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-2 pb-2">
          {items.map((t) => (
            <PaletteItem key={t} type={t} />
          ))}
        </div>
      )}
    </div>
  )
}

export function ElementPalette() {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Elements Palette</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <Section title="Form Elements" items={FORM_ITEMS} />
        <Section title="Data Widgets" items={WIDGET_ITEMS} />
      </div>
    </aside>
  )
}
