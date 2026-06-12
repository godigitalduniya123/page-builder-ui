export type ElementType =
  // form elements
  | "text"
  | "heading"
  | "input"
  | "textarea"
  | "button"
  | "radio"
  | "checkbox"
  | "select"
  // data widgets
  | "value-card"
  | "gauge"
  | "line-chart"
  | "bar-chart"
  | "status"
  | "table"

export type ElementCategory = "form" | "widget"

export interface ElementStyle {
  backgroundColor: string
  textColor: string
  fontSize: number
  fontWeight: string
  borderRadius: number
  borderWidth: number
  borderColor: string
  padding: number
  opacity: number
}

export interface DataBinding {
  source: string
  field: string
  refresh: "live" | "manual"
}

export interface ContentConfig {
  label: string
  placeholder: string
  options: string[]
  required: boolean
}

export interface CanvasElementData {
  id: string
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  style: ElementStyle
  data: DataBinding
  content: ContentConfig
}

export const WIDGET_TYPES: ElementType[] = [
  "value-card",
  "gauge",
  "line-chart",
  "bar-chart",
  "status",
  "table",
]

export const FORM_TYPES: ElementType[] = [
  "text",
  "heading",
  "input",
  "textarea",
  "button",
  "radio",
  "checkbox",
  "select",
]

export function isWidget(type: ElementType): boolean {
  return WIDGET_TYPES.includes(type)
}

export const ELEMENT_LABELS: Record<ElementType, string> = {
  text: "Text",
  heading: "Heading",
  input: "Input",
  textarea: "Textarea",
  button: "Button",
  radio: "Radio Group",
  checkbox: "Checkbox",
  select: "Dropdown",
  "value-card": "Value Card",
  gauge: "Gauge",
  "line-chart": "Line Chart",
  "bar-chart": "Bar Chart",
  status: "Status",
  table: "Table",
}

export const DATA_SOURCES = ["Machine 1", "Machine 2", "Conveyor Belt Sensor"]
export const DATA_FIELDS = ["Temperature", "Pressure", "RPM", "Status"]

export function defaultStyle(): ElementStyle {
  return {
    backgroundColor: "#ffffff",
    textColor: "#1e293b",
    fontSize: 14,
    fontWeight: "normal",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 12,
    opacity: 100,
  }
}

export function defaultSize(type: ElementType): { width: number; height: number } {
  switch (type) {
    case "heading":
      return { width: 320, height: 56 }
    case "text":
      return { width: 240, height: 40 }
    case "button":
      return { width: 140, height: 44 }
    case "input":
    case "select":
      return { width: 240, height: 44 }
    case "textarea":
      return { width: 260, height: 100 }
    case "checkbox":
    case "radio":
      return { width: 200, height: 90 }
    case "value-card":
      return { width: 200, height: 120 }
    case "gauge":
      return { width: 180, height: 180 }
    case "line-chart":
    case "bar-chart":
      return { width: 320, height: 200 }
    case "status":
      return { width: 160, height: 56 }
    case "table":
      return { width: 360, height: 200 }
    default:
      return { width: 200, height: 100 }
  }
}

export function defaultContent(type: ElementType): ContentConfig {
  const base: ContentConfig = {
    label: ELEMENT_LABELS[type],
    placeholder: "Enter value...",
    options: [],
    required: false,
  }
  if (type === "radio" || type === "select") {
    base.options = ["Option 1", "Option 2", "Option 3"]
  }
  return base
}
