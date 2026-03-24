import type {
  DailyReport,
  DetectionResult,
  HygieneAlert,
  Metric,
} from '../types'

export const mockHygieneScore = 87

export const mockMetrics: Metric[] = [
  {
    id: 'hand-hygiene',
    label: 'Hand Hygiene Compliance',
    value: '92%',
    trend: 'up',
    change: 4.2,
    sparkline: [78, 80, 79, 83, 84, 86, 88, 91, 92, 92],
  },
  {
    id: 'ppe-usage',
    label: 'PPE Usage',
    value: '88%',
    trend: 'down',
    change: -1.3,
    sparkline: [92, 91, 90, 90, 89, 89, 88, 88, 87, 88],
  },
  {
    id: 'surface-cleanliness',
    label: 'Surface Cleanliness',
    value: '94%',
    trend: 'up',
    change: 2.1,
    sparkline: [88, 89, 90, 91, 92, 92, 93, 94, 94, 94],
  },
  {
    id: 'incident-rate',
    label: 'Incident Rate',
    value: '1.4 / 100 checks',
    trend: 'neutral',
    change: 0,
    sparkline: [1.2, 1.1, 1.3, 1.5, 1.4, 1.4, 1.6, 1.3, 1.4, 1.4],
  },
]

export const mockComplianceOverTime = [
  { t: 'Jan', score: 82, target: 86 },
  { t: 'Feb', score: 86, target: 88 },
  { t: 'Mar', score: 84, target: 87 },
  { t: 'Apr', score: 89, target: 90 },
  { t: 'May', score: 87, target: 89 },
  { t: 'Jun', score: 91, target: 92 },
]

export const mockAlerts: HygieneAlert[] = [
  {
    id: 'AL-1023',
    area: 'Prep Station A',
    timestamp: 'Today • 11:42',
    status: 'violation',
    description: 'Gloves missing while handling ready-to-eat ingredients.',
    snapshotUrl: '',
    violations: ['No gloves detected', 'Direct food contact'],
    resolved: false,
  },
  {
    id: 'AL-1019',
    area: 'Fryer Station',
    timestamp: 'Today • 10:18',
    status: 'warning',
    description: 'Staff touched face before returning to food handling.',
    snapshotUrl: '',
    violations: ['Potential cross-contamination'],
    resolved: false,
  },
  {
    id: 'AL-1011',
    area: 'Dishwashing',
    timestamp: 'Yesterday • 19:04',
    status: 'compliant',
    description: 'Issue resolved and verified by re-check.',
    snapshotUrl: '',
    violations: ['Standing water near drain'],
    resolved: true,
  },
]

export const mockDetections: DetectionResult[] = [
  {
    id: 'DR-2301',
    frameTime: 'Live • 00:02',
    score: 0.84,
    status: 'warning',
    detectedViolations: ['Missing hairnet', 'Loose apron'],
  },
  {
    id: 'DR-2298',
    frameTime: 'Today • 11:35',
    score: 0.93,
    status: 'compliant',
    detectedViolations: [],
  },
]

export const mockDailyReports: DailyReport[] = [
  {
    date: 'Mon',
    averageScore: 83,
    totalChecks: 142,
    criticalViolations: 3,
  },
  {
    date: 'Tue',
    averageScore: 86,
    totalChecks: 151,
    criticalViolations: 2,
  },
  {
    date: 'Wed',
    averageScore: 88,
    totalChecks: 167,
    criticalViolations: 1,
  },
  {
    date: 'Thu',
    averageScore: 90,
    totalChecks: 174,
    criticalViolations: 1,
  },
  {
    date: 'Fri',
    averageScore: 87,
    totalChecks: 163,
    criticalViolations: 2,
  },
]

