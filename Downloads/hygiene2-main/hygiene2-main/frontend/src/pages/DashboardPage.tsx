import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, LineChart, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  mockAlerts,
  mockComplianceOverTime,
  mockHygieneScore,
  mockMetrics,
} from '../data/mockData'
import { AlertCard } from '../components/AlertCard'
import { MetricCard } from '../components/MetricCard'
import { ScoreCard } from '../components/ScoreCard'
import type { HygieneAlert } from '../types'
import { Page } from '../components/Page'
import { GlassCard } from '../components/GlassCard'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Hero195 } from '@/components/ui/hero-195'
import { motion } from 'framer-motion'

const BACKEND = 'http://localhost:8000'

export function DashboardPage() {
  const navigate = useNavigate()
  const [hygieneScore, setHygieneScore] = useState(mockHygieneScore)
  const [alerts] = useState<HygieneAlert[]>(mockAlerts)

  // Fetch live score and alerts on mount
  useEffect(() => {
    fetch(`${BACKEND}/api/v1/live/status`)
      .then((r) => r.json())
      .then((d) => { if (d.score_int) setHygieneScore(d.score_int) })
      .catch(() => { })
  }, [])

  const recentAlerts = useMemo(() => alerts.slice(0, 3), [alerts])
  const openAlertsCount = useMemo(() => alerts.filter((a) => !a.resolved).length, [alerts])

  return (
    <Page className="space-y-6">
      <Hero195 />
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI-powered hygiene compliance overview across active stations.
          </p>
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/alerts')}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground hover:bg-muted cursor-pointer"
        >
          <AlertTriangle className="h-4 w-4 text-warning" />
          {openAlertsCount > 0 ? `${openAlertsCount} open alert${openAlertsCount > 1 ? 's' : ''} — view` : 'No open alerts'}
          <ArrowRight className="h-3.5 w-3.5" />
        </motion.button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ScoreCard score={hygieneScore} subtitle="Current shift (last 60 min)" />
        </div>
        <div className="grid gap-4 lg:col-span-2 sm:grid-cols-2">
          {mockMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Trend
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                Compliance over time
              </h2>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral/10 text-neutral">
              <LineChart className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={mockComplianceOverTime}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="areaWarm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(253, 164, 175, 0.65)" />
                    <stop offset="100%" stopColor="rgba(253, 164, 175, 0.06)" />
                  </linearGradient>
                  <linearGradient id="areaCool" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(94, 234, 212, 0.55)" />
                    <stop offset="100%" stopColor="rgba(94, 234, 212, 0.08)" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(2, 6, 23, 0.06)" vertical={false} />
                <XAxis
                  dataKey="t"
                  tick={{ fill: 'rgba(71, 85, 105, 0.9)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide domain={[60, 100]} />
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
                <Area
                  type="natural"
                  dataKey="target"
                  stroke="rgba(251, 113, 133, 0.8)"
                  strokeWidth={2}
                  fill="url(#areaWarm)"
                  fillOpacity={1}
                  dot={false}
                  isAnimationActive
                />
                <Area
                  type="natural"
                  dataKey="score"
                  stroke="rgba(45, 212, 191, 0.9)"
                  strokeWidth={2}
                  fill="url(#areaCool)"
                  fillOpacity={1}
                  dot={false}
                  isAnimationActive
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Recent alerts
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                Last 3 events
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> Resolved
                </span>
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4" /> Pending
                </span>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/alerts')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </motion.button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {recentAlerts.map((a) => (
              <AlertCard key={a.id} alert={a} />
            ))}
          </div>
        </GlassCard>
      </div>
    </Page>
  )
}

