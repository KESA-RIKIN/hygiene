import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Metric } from '../types'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { GlassCard } from './GlassCard'

interface MetricCardProps {
  metric: Metric
}

function TrendIcon({ trend }: { trend: Metric['trend'] }) {
  if (trend === 'up') return <ArrowUpRight className="h-4 w-4" />
  if (trend === 'down') return <ArrowDownRight className="h-4 w-4" />
  return <ArrowRight className="h-4 w-4" />
}

function trendColor(trend: Metric['trend']) {
  if (trend === 'up') return 'text-emerald-700'
  if (trend === 'down') return 'text-rose-700'
  return 'text-muted-foreground'
}

export function MetricCard({ metric }: MetricCardProps) {
  const data = (metric.sparkline ?? []).map((v, i) => ({ i, v }))

  return (
    <GlassCard className="p-4 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {metric.label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {metric.value}
          </p>
        </div>
        <div
          className={`inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-1 text-xs font-medium ${trendColor(
            metric.trend,
          )}`}
        >
          <TrendIcon trend={metric.trend} />
          <span>
            {metric.change > 0 ? '+' : ''}
            {metric.change}%
          </span>
        </div>
      </div>

      <div className="mt-4 h-14">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`metricOrangeFill-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(251, 146, 60, 0.22)" />
                <stop offset="70%" stopColor="rgba(251, 146, 60, 0.08)" />
                <stop offset="100%" stopColor="rgba(251, 146, 60, 0.00)" />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="rgba(251, 146, 60, 0.40)"
              vertical={false}
              strokeDasharray="6 6"
            />
            <Tooltip
              cursor={false}
              contentStyle={{
                background: 'rgba(255,255,255,0.92)',
                border: '1px solid rgba(2, 6, 23, 0.10)',
                borderRadius: 12,
                color: 'rgba(15, 23, 42, 0.92)',
                backdropFilter: 'blur(10px)',
              }}
              labelStyle={{ display: 'none' }}
            />
            <Area
              type="natural"
              dataKey="v"
              stroke="rgba(251, 146, 60, 0.95)"
              strokeWidth={2}
              fill={`url(#metricOrangeFill-${metric.id})`}
              fillOpacity={1}
              isAnimationActive
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0, fill: 'rgba(251, 146, 60, 0.95)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}

