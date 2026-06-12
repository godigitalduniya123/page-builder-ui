"use client"

import { useState } from "react"
import { MousePointer2 } from "lucide-react"
import { useBuilderStore } from "@/lib/builder-store"
import {
  DATA_SOURCES,
  DATA_FIELDS,
  isWidget,
  type CanvasElementData,
} from "@/lib/builder-types"
import { mockValue } from "./element-content"
import { cn } from "@/lib/utils"

type Tab = "style" | "data" | "content"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

const inputCls =
  "h-8 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"

function NumberInput({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={inputCls}
    />
  )
}

function ColorInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value === "transparent" ? "#ffffff" : value}
        onChange={(e) => onChange(e.target.value)}
        className="size-8 shrink-0 cursor-pointer rounded border border-input bg-background p-0.5"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </div>
  )
}

function Slider({
  value,
  min,
  max,
  onChange,
}: {
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-primary"
      />
      <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">
        {value}
      </span>
    </div>
  )
}

function StyleTab({ el }: { el: CanvasElementData }) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  const updateStyle = useBuilderStore((s) => s.updateStyle)
  const { style } = el
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="X">
          <NumberInput value={el.x} onChange={(v) => updateElement(el.id, { x: v })} />
        </Field>
        <Field label="Y">
          <NumberInput value={el.y} onChange={(v) => updateElement(el.id, { y: v })} />
        </Field>
        <Field label="Width">
          <NumberInput value={el.width} onChange={(v) => updateElement(el.id, { width: v })} />
        </Field>
        <Field label="Height">
          <NumberInput value={el.height} onChange={(v) => updateElement(el.id, { height: v })} />
        </Field>
      </div>
      <Field label="Background Color">
        <ColorInput value={style.backgroundColor} onChange={(v) => updateStyle(el.id, { backgroundColor: v })} />
      </Field>
      <Field label="Text Color">
        <ColorInput value={style.textColor} onChange={(v) => updateStyle(el.id, { textColor: v })} />
      </Field>
      <Field label="Font Size">
        <Slider value={style.fontSize} min={8} max={64} onChange={(v) => updateStyle(el.id, { fontSize: v })} />
      </Field>
      <Field label="Font Weight">
        <select
          value={style.fontWeight}
          onChange={(e) => updateStyle(el.id, { fontWeight: e.target.value })}
          className={inputCls}
        >
          <option value="normal">Normal</option>
          <option value="500">Medium</option>
          <option value="600">Semibold</option>
          <option value="bold">Bold</option>
        </select>
      </Field>
      <Field label="Border Radius">
        <Slider value={style.borderRadius} min={0} max={40} onChange={(v) => updateStyle(el.id, { borderRadius: v })} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Border Width">
          <NumberInput value={style.borderWidth} onChange={(v) => updateStyle(el.id, { borderWidth: v })} />
        </Field>
        <Field label="Border Color">
          <input
            type="color"
            value={style.borderColor}
            onChange={(e) => updateStyle(el.id, { borderColor: e.target.value })}
            className="h-8 w-full cursor-pointer rounded border border-input bg-background p-0.5"
          />
        </Field>
      </div>
      <Field label="Padding">
        <NumberInput value={style.padding} onChange={(v) => updateStyle(el.id, { padding: v })} />
      </Field>
      <Field label="Opacity">
        <Slider value={style.opacity} min={0} max={100} onChange={(v) => updateStyle(el.id, { opacity: v })} />
      </Field>
    </div>
  )
}

function DataTab({ el }: { el: CanvasElementData }) {
  const updateData = useBuilderStore((s) => s.updateData)
  return (
    <div className="flex flex-col gap-4">
      <Field label="Data Source">
        <select
          value={el.data.source}
          onChange={(e) => updateData(el.id, { source: e.target.value })}
          className={inputCls}
        >
          {DATA_SOURCES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>
      <Field label="Field">
        <select
          value={el.data.field}
          onChange={(e) => updateData(el.id, { field: e.target.value })}
          className={inputCls}
        >
          {DATA_FIELDS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </Field>
      <Field label="Refresh Behavior">
        <div className="flex flex-col gap-2 pt-1">
          {(["live", "manual"] as const).map((mode) => (
            <label key={mode} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={el.data.refresh === mode}
                onChange={() => updateData(el.id, { refresh: mode })}
                className="accent-primary"
              />
              {mode === "live" ? "Live (real-time)" : "Manual"}
            </label>
          ))}
        </div>
      </Field>
      <div className="rounded-md border border-border bg-muted/50 p-3">
        <span className="text-xs font-medium text-muted-foreground">Current Value</span>
        <div className="mt-1 text-2xl font-bold">{mockValue(el.data.field)}</div>
        <span className="text-xs text-muted-foreground">{el.data.source}</span>
      </div>
    </div>
  )
}

function ContentTab({ el }: { el: CanvasElementData }) {
  const updateContent = useBuilderStore((s) => s.updateContent)
  const hasOptions = el.type === "radio" || el.type === "select"
  return (
    <div className="flex flex-col gap-4">
      <Field label="Label">
        <input
          type="text"
          value={el.content.label}
          onChange={(e) => updateContent(el.id, { label: e.target.value })}
          className={inputCls}
        />
      </Field>
      <Field label="Placeholder">
        <input
          type="text"
          value={el.content.placeholder}
          onChange={(e) => updateContent(el.id, { placeholder: e.target.value })}
          className={inputCls}
        />
      </Field>
      {hasOptions && (
        <Field label="Options">
          <div className="flex flex-col gap-2">
            {el.content.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const next = [...el.content.options]
                    next[i] = e.target.value
                    updateContent(el.id, { options: next })
                  }}
                  className={inputCls}
                />
                <button
                  onClick={() =>
                    updateContent(el.id, {
                      options: el.content.options.filter((_, j) => j !== i),
                    })
                  }
                  className="flex size-8 shrink-0 items-center justify-center rounded-md border border-input text-muted-foreground hover:bg-accent"
                  aria-label="Remove option"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                updateContent(el.id, {
                  options: [...el.content.options, `Option ${el.content.options.length + 1}`],
                })
              }
              className="rounded-md border border-dashed border-input py-1.5 text-sm text-muted-foreground hover:bg-accent"
            >
              + Add option
            </button>
          </div>
        </Field>
      )}
      <label className="flex items-center justify-between rounded-md border border-border px-3 py-2">
        <span className="text-sm font-medium">Required</span>
        <input
          type="checkbox"
          checked={el.content.required}
          onChange={(e) => updateContent(el.id, { required: e.target.checked })}
          className="size-4 accent-primary"
        />
      </label>
    </div>
  )
}

export function PropertiesPanel() {
  const selectedId = useBuilderStore((s) => s.selectedId)
  const element = useBuilderStore((s) => s.elements.find((e) => e.id === s.selectedId))
  const [tab, setTab] = useState<Tab>("style")

  if (!selectedId || !element) {
    return (
      <aside className="flex w-[300px] shrink-0 flex-col border-l border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Properties</h2>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <MousePointer2 className="size-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground text-pretty">
            No element selected. Click an element on the canvas to edit its properties.
          </p>
        </div>
      </aside>
    )
  }

  const widget = isWidget(element.type)
  const tabs: { id: Tab; label: string; show: boolean }[] = [
    { id: "style", label: "Style", show: true },
    { id: "data", label: "Data", show: widget },
    { id: "content", label: "Content", show: !widget },
  ]
  const activeTab = tabs.find((t) => t.id === tab && t.show) ? tab : "style"

  return (
    <aside className="flex w-[300px] shrink-0 flex-col border-l border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Properties</h2>
      </div>
      <div className="flex border-b border-border">
        {tabs.filter((t) => t.show).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              activeTab === t.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "style" && <StyleTab el={element} />}
        {activeTab === "data" && <DataTab el={element} />}
        {activeTab === "content" && <ContentTab el={element} />}
      </div>
    </aside>
  )
}
