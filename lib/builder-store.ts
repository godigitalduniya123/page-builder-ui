import { create } from "zustand"
import {
  type CanvasElementData,
  type ElementType,
  defaultStyle,
  defaultSize,
  defaultContent,
} from "@/lib/builder-types"

let idCounter = 100

function makeId() {
  idCounter += 1
  return `el-${idCounter}`
}

export function createElement(
  type: ElementType,
  x: number,
  y: number,
): CanvasElementData {
  const size = defaultSize(type)
  return {
    id: makeId(),
    type,
    x,
    y,
    width: size.width,
    height: size.height,
    style: defaultStyle(),
    data: { source: "Machine 1", field: "Temperature", refresh: "live" },
    content: defaultContent(type),
  }
}

interface BuilderState {
  elements: CanvasElementData[]
  selectedId: string | null
  pageTitle: string
  status: "Draft" | "Published"
  addElement: (type: ElementType, x: number, y: number) => void
  selectElement: (id: string | null) => void
  updateElement: (id: string, patch: Partial<CanvasElementData>) => void
  updateStyle: (id: string, patch: Partial<CanvasElementData["style"]>) => void
  updateData: (id: string, patch: Partial<CanvasElementData["data"]>) => void
  updateContent: (id: string, patch: Partial<CanvasElementData["content"]>) => void
  deleteElement: (id: string) => void
  duplicateElement: (id: string) => void
  setPageTitle: (title: string) => void
  setStatus: (status: "Draft" | "Published") => void
}

function sampleElements(): CanvasElementData[] {
  const heading = createElement("heading", 48, 40)
  heading.width = 420
  heading.content.label = "Production Dashboard"
  heading.style.fontSize = 28
  heading.style.fontWeight = "bold"
  heading.style.borderWidth = 0
  heading.style.backgroundColor = "transparent"

  const input = createElement("input", 48, 130)
  input.content.label = "Operator Name"
  input.content.placeholder = "Enter operator name"

  const valueCard = createElement("value-card", 48, 240)
  valueCard.content.label = "Temperature"
  valueCard.data.field = "Temperature"

  const lineChart = createElement("line-chart", 300, 130)
  lineChart.content.label = "RPM Over Time"
  lineChart.data.field = "RPM"

  return [heading, input, valueCard, lineChart]
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  elements: sampleElements(),
  selectedId: null,
  pageTitle: "Untitled Page",
  status: "Draft",
  addElement: (type, x, y) => {
    const el = createElement(type, x, y)
    set((s) => ({ elements: [...s.elements, el], selectedId: el.id }))
  },
  selectElement: (id) => set({ selectedId: id }),
  updateElement: (id, patch) =>
    set((s) => ({
      elements: s.elements.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    })),
  updateStyle: (id, patch) =>
    set((s) => ({
      elements: s.elements.map((e) =>
        e.id === id ? { ...e, style: { ...e.style, ...patch } } : e,
      ),
    })),
  updateData: (id, patch) =>
    set((s) => ({
      elements: s.elements.map((e) =>
        e.id === id ? { ...e, data: { ...e.data, ...patch } } : e,
      ),
    })),
  updateContent: (id, patch) =>
    set((s) => ({
      elements: s.elements.map((e) =>
        e.id === id ? { ...e, content: { ...e.content, ...patch } } : e,
      ),
    })),
  deleteElement: (id) =>
    set((s) => ({
      elements: s.elements.filter((e) => e.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),
  duplicateElement: (id) => {
    const el = get().elements.find((e) => e.id === id)
    if (!el) return
    const copy: CanvasElementData = {
      ...el,
      id: makeId(),
      x: el.x + 24,
      y: el.y + 24,
      style: { ...el.style },
      data: { ...el.data },
      content: { ...el.content, options: [...el.content.options] },
    }
    set((s) => ({ elements: [...s.elements, copy], selectedId: copy.id }))
  },
  setPageTitle: (title) => set({ pageTitle: title }),
  setStatus: (status) => set({ status }),
}))
