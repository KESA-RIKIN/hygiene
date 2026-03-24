export type HygieneStatus = 'compliant' | 'warning' | 'violation' | 'neutral'

export interface HygieneAlert {
  id: string
  area: string
  timestamp: string
  status: HygieneStatus
  description: string
  snapshotUrl?: string
  violations: string[]
  resolved: boolean
}

export interface DetectionResult {
  id: string
  frameTime: string
  score: number
  status: HygieneStatus
  detectedViolations: string[]
}

export interface Metric {
  id: string
  label: string
  value: string | number
  trend: 'up' | 'down' | 'neutral'
  change: number
  sparkline?: number[]
}

export interface DailyReport {
  date: string
  averageScore: number
  totalChecks: number
  criticalViolations: number
}

