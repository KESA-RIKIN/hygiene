import { Download, BarChart3 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { mockDailyReports, mockHygieneScore } from '../data/mockData'
import type { DailyReport } from '../types'
import { Page } from '../components/Page'
import { GlassCard } from '../components/GlassCard'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function ReportsPage() {
  const [dailyScore] = useState(mockHygieneScore)
  const [reports] = useState<DailyReport[]>(mockDailyReports)

  const weeklyAverage = useMemo(() => {
    const avg =
      reports.reduce((sum, r) => sum + r.averageScore, 0) / reports.length
    return Math.round(avg)
  }, [reports])

  return (
    <Page className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Reports
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Daily summaries and weekly performance overview.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-[1px]"
          onClick={() => {
            const blob = new Blob(
              [JSON.stringify({ dailyScore, weeklyAverage, reports }, null, 2)],
              { type: 'application/json' },
            )
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'hygiene-report.json'
            a.click()
            URL.revokeObjectURL(url)
          }}
        >
          <Download className="h-4 w-4" />
          Download report
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Daily score
          </p>
          <p className="mt-2 text-4xl font-bold text-foreground">
            {dailyScore}
            <span className="text-sm text-muted-foreground"> / 100</span>
          </p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Weekly average
          </p>
          <p className="mt-2 text-4xl font-bold text-foreground">
            {weeklyAverage}
            <span className="text-sm text-muted-foreground"> / 100</span>
          </p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Checks this week
          </p>
          <p className="mt-2 text-4xl font-bold text-foreground">
            {reports.reduce((sum, r) => sum + r.totalChecks, 0)}
          </p>
        </GlassCard>
      </div>

      <GlassCard className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Weekly distribution
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
              Average score by day
            </h2>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BarChart3 className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reports} margin={{ top: 12, right: 16, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(253, 164, 175, 0.85)" />
                  <stop offset="100%" stopColor="rgba(94, 234, 212, 0.55)" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(2, 6, 23, 0.06)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: 'rgba(71, 85, 105, 0.9)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(71, 85, 105, 0.9)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255,255,255,0.92)',
                  border: '1px solid rgba(2, 6, 23, 0.10)',
                  borderRadius: 14,
                  color: 'rgba(15, 23, 42, 0.92)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                }}
              />
              <Bar
                dataKey="averageScore"
                fill="url(#barFill)"
                radius={[10, 10, 6, 6]}
                isAnimationActive
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-2">
          {reports.map((r) => (
            <div
              key={r.date}
              className="rounded-2xl border border-border bg-card p-3"
            >
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {r.date}
              </p>
              <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                {r.averageScore}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {r.criticalViolations} critical
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </Page>
  )
}

