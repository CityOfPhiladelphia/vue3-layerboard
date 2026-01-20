/**
 * Layer Configuration Types
 */

export interface LegendItem {
  type: 'fill' | 'line' | 'circle'
  color: string
  label: string
  width?: number
  radius?: number
}

export interface PopupFieldFormat {
  dateFormat?: string
  digitSeparator?: boolean
  places?: number
}

export interface PopupField {
  field: string
  label: string
  format?: PopupFieldFormat
}

export interface PopupConfig {
  title: string
  fields: PopupField[]
}

export interface LayerConfig {
  id: string
  title: string
  type: 'fill' | 'line' | 'circle'
  url: string
  where?: string
  minZoom?: number
  maxZoom?: number
  opacity: number
  paint?: Record<string, unknown>
  outlinePaint?: Record<string, unknown>
  legend: LegendItem[]
  popup: PopupConfig | null
}

// MapLibre-specific paint property interfaces
export interface CirclePaint {
  'circle-radius': number | unknown[]
  'circle-color': string | unknown[]
  'circle-opacity'?: number
  'circle-stroke-width'?: number
  'circle-stroke-color'?: string
}

export interface LinePaint {
  'line-width': number | unknown[]
  'line-color': string | unknown[]
  'line-opacity'?: number
}

export interface FillPaint {
  'fill-color': string | unknown[]
  'fill-opacity'?: number
  'fill-outline-color'?: string
}
