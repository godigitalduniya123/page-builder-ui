"use client"

import { Layers, Eye, Save, Rocket } from "lucide-react"
import { useBuilderStore } from "@/lib/builder-store"
import { cn } from "@/lib/utils"

export function TopBar() {
  const pageTitle = useBuilderStore((s) => s.pageTitle)
  const setPageTitle = useBuilderStore((s) => s.setPageTitle)
  const status = useBuilderStore((s) => s.status)
  const setStatus = useBuilderStore((s) => s.setStatus)

  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4">
      <div className="flex w-60 items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Layers className="size-4" />
        </div>
        <span className="text-sm font-semibold">Page Builder</span>
      </div>

      <div className="flex flex-1 items-center justify-center gap-3">
        <input
          value={pageTitle}
          onChange={(e) => setPageTitle(e.target.value)}
          className="w-64 rounded-md border border-transparent bg-transparent px-2 py-1 text-center text-sm font-medium outline-none hover:border-border focus:border-primary focus:bg-background"
          aria-label="Page title"
        />
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            status === "Published"
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700",
          )}
        >
          {status}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent">
          <Eye className="size-4" />
          Preview
        </button>
        <button
          onClick={() => setStatus("Draft")}
          className="flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent"
        >
          <Save className="size-4" />
          Save Draft
        </button>
        <button
          onClick={() => setStatus("Published")}
          className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Rocket className="size-4" />
          Submit & Deploy
        </button>
      </div>
    </header>
  )
}
