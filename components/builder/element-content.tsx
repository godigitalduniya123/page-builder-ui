"use client"

import { type CanvasElementData, DATA_SOURCES } from "@/lib/builder-types"
import { ChevronDown } from "lucide-react"

// Deterministic mock value derived from the binding so previews look stable.
export function mockValue(field: string): string {
  switch (field) {
    case "Temperature":
      return "72.4°C"
    case "Pressure":
      return "3.2 bar"
    case "RPM":
      return "1,480"
    case "Status":
      return "Running"
    default:
      return "—"
  }
}

const SPARK = [18, 42, 30, 55, 38, 68, 50, 80, 62, 90]
const BARS = [40, 70, 55, 85, 60, 75]

export function ElementContent({ element }: { element: CanvasElementData }) {
  const { type, content, data, style } = element
  const accent = "#4f46e5"

  switch (type) {
    case "heading":
      return (
        <div
          className="font-semibold leading-tight text-pretty"
          style={{ fontSize: style.fontSize, fontWeight: style.fontWeight }}
        >
          {content.label}
        </div>
      )
    case "text":
      return (
        <p className="leading-relaxed" style={{ fontSize: style.fontSize }}>
          {content.label || "Text block"}
        </p>
      )
    case "input":
      return (
        <div className="flex w-full flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            {content.label}
            {content.required && <span className="text-destructive"> *</span>}
          </span>
          <div className="flex h-9 w-full items-center rounded-md border border-input bg-background px-3 text-sm text-muted-foreground">
            {content.placeholder}
          </div>
        </div>
      )
    case "textarea":
      return (
        <div className="flex h-full w-full flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            {content.label}
          </span>
          <div className="flex-1 rounded-md border border-input bg-background p-2 text-sm text-muted-foreground">
            {content.placeholder}
          </div>
        </div>
      )
    case "button":
      return (
        <button
          type="button"
          className="flex h-full w-full items-center justify-center rounded-md px-4 text-sm font-medium text-white"
          style={{ backgroundColor: accent }}
        >
          {content.label}
        </button>
      )
    case "radio":
      return (
        <div className="flex w-full flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {content.label}
          </span>
          {content.options.map((opt, i) => (
            <label key={i} className="flex items-center gap-2 text-sm">
              <span
                className="inline-block size-3.5 rounded-full border-2"
                style={{ borderColor: i === 0 ? accent : "#cbd5e1" }}
              />
              {opt}
            </label>
          ))}
        </div>
      )
    case "checkbox":
      return (
        <div className="flex w-full flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {content.label}
          </span>
          <label className="flex items-center gap-2 text-sm">
            <span className="inline-block size-3.5 rounded border-2 border-slate-300" />
            {content.placeholder || "Checkbox option"}
          </label>
        </div>
      )
    case "select":
      return (
        <div className="flex w-full flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            {content.label}
          </span>
          <div className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm text-muted-foreground">
            {content.options[0] ?? "Select..."}
            <ChevronDown className="size-4" />
          </div>
        </div>
      )
    case "value-card":
      return (
        <div className="flex h-full w-full flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {content.label}
          </span>
          <span className="text-3xl font-bold tracking-tight">
            {mockValue(data.field)}
          </span>
          <span className="text-xs text-muted-foreground">{data.source}</span>
        </div>
      )
    case "gauge": {
      const pct = 0.68
      const r = 30
      const c = 2 * Math.PI * r
      return (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <svg viewBox="0 0 80 80" className="size-20 -rotate-90">
            <circle cx="40" cy="40" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle
              cx="40"
              cy="40"
              r={r}
              fill="none"
              stroke={accent}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - pct)}
            />
          </svg>
          <span className="mt-1 text-sm font-semibold">{mockValue(data.field)}</span>
        </div>
      )
    }
    case "line-chart":
      return (
        <div className="flex h-full w-full flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            {content.label}
          </span>
          <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="flex-1 w-full">
            <polyline
              fill="none"
              stroke={accent}
              strokeWidth="2"
              points={SPARK.map((v, i) => `${(i / (SPARK.length - 1)) * 100},${50 - (v / 100) * 48}`).join(" ")}
            />
          </svg>
        </div>
      )
    case "bar-chart":
      return (
        <div className="flex h-full w-full flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            {content.label}
          </span>
          <div className="flex flex-1 items-end justify-between gap-1.5">
            {BARS.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t"
                style={{ height: `${v}%`, backgroundColor: accent, opacity: 0.85 }}
              />
            ))}
          </div>
        </div>
      )
    case "status": {
      const color = data.field === "Status" ? "#16a34a" : "#f59e0b"
      return (
        <div className="flex h-full w-full items-center gap-2">
          <span
            className="inline-block size-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-medium">{content.label}</span>
        </div>
      )
    }
    case "table":
      return (
        <div className="flex h-full w-full flex-col gap-1 overflow-hidden">
          <span className="text-xs font-medium text-muted-foreground">
            {content.label}
          </span>
          <div className="flex-1 overflow-hidden rounded border border-border">
            <div className="grid grid-cols-3 bg-muted text-xs font-semibold">
              {["Source", "Field", "Value"].map((h) => (
                <div key={h} className="border-b border-border px-2 py-1">{h}</div>
              ))}
            </div>
            {DATA_SOURCES.map((src, i) => (
              <div key={i} className="grid grid-cols-3 text-xs">
                <div className="border-b border-border px-2 py-1">{src}</div>
                <div className="border-b border-border px-2 py-1">{data.field}</div>
                <div className="border-b border-border px-2 py-1">{mockValue(data.field)}</div>
              </div>
            ))}
          </div>
        </div>
      )
    default:
      return null
  }
}
