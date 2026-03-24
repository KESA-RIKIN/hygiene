import { Shield } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { GlassCard } from './GlassCard'

interface ScoreCardProps {
  score: number
  subtitle?: string
}

function toneFromScore(score: number) {
  if (score < 50) return 'critical'
  if (score >= 50 && score < 75) return 'warning'
  if (score > 80) return 'success'
  return 'primary'
}

function gradientForTone(tone: ReturnType<typeof toneFromScore>) {
  if (tone === 'success') return 'from-emerald-400 to-green-500'
  if (tone === 'warning') return 'from-yellow-400 to-orange-500'
  if (tone === 'critical') return 'from-red-500 to-pink-500'
  return 'from-purple-500 to-cyan-400'
}

export function ScoreCard({ score, subtitle }: ScoreCardProps) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    const durationMs = 850
    const start = performance.now()
    const from = displayScore
    const to = score

    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayScore(Math.round(from + (to - from) * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score])

  const tone = toneFromScore(score)
  const grad = gradientForTone(tone)

  const ring = useMemo(() => {
    const size = 184
    const stroke = 12
    const r = (size - stroke) / 2
    const c = 2 * Math.PI * r
    const pct = Math.max(0, Math.min(100, score))
    const dash = (pct / 100) * c
    const gap = c - dash
    return { size, stroke, r, c, dash, gap }
  }, [score])

  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Hygiene Score
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {subtitle ?? 'Real-time compliance index'}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Shield className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <div className="relative grid place-items-center">
          <div
            className={`absolute inset-0 rounded-full blur-2xl opacity-20 bg-gradient-to-r ${grad}`}
            style={{ width: ring.size, height: ring.size }}
          />

          <div
            className="relative grid place-items-center rounded-full border border-border bg-card shadow-sm"
            style={{ width: ring.size, height: ring.size }}
          >
            <svg
              width={ring.size}
              height={ring.size}
              viewBox={`0 0 ${ring.size} ${ring.size}`}
              className="absolute inset-0 rotate-[-90deg]"
            >
              <defs>
                <linearGradient id="scoreGradPrimary" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgb(168 85 247)" />
                  <stop offset="100%" stopColor="rgb(34 211 238)" />
                </linearGradient>
                <linearGradient id="scoreGradSuccess" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgb(52 211 153)" />
                  <stop offset="100%" stopColor="rgb(34 197 94)" />
                </linearGradient>
                <linearGradient id="scoreGradWarning" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgb(250 204 21)" />
                  <stop offset="100%" stopColor="rgb(249 115 22)" />
                </linearGradient>
                <linearGradient id="scoreGradCritical" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgb(239 68 68)" />
                  <stop offset="100%" stopColor="rgb(236 72 153)" />
                </linearGradient>
              </defs>

              <circle
                cx={ring.size / 2}
                cy={ring.size / 2}
                r={ring.r}
                stroke="rgba(2,6,23,0.10)"
                strokeWidth={ring.stroke}
                fill="transparent"
              />
              <circle
                cx={ring.size / 2}
                cy={ring.size / 2}
                r={ring.r}
                stroke={
                  tone === 'success'
                    ? 'url(#scoreGradSuccess)'
                    : tone === 'warning'
                      ? 'url(#scoreGradWarning)'
                      : tone === 'critical'
                        ? 'url(#scoreGradCritical)'
                        : 'url(#scoreGradPrimary)'
                }
                strokeWidth={ring.stroke}
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray={`${ring.dash} ${ring.gap}`}
                style={{ filter: 'drop-shadow(0 6px 16px rgba(2,6,23,0.14))' }}
              />
            </svg>

            <div className="relative text-center">
              <p className="text-5xl font-bold tracking-tight text-foreground">
                {displayScore}
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                out of 100
              </p>
              <div className="mt-3 inline-flex items-center justify-center rounded-full border border-border bg-muted px-3 py-1 text-[11px] text-muted-foreground">
                <span className={`mr-2 inline-block h-2 w-2 rounded-full bg-gradient-to-r ${grad}`} />
                Live index
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-border bg-card px-3 py-2">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Good
          </p>
          <p className="mt-1 text-sm font-semibold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            Green
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card px-3 py-2">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Medium
          </p>
          <p className="mt-1 text-sm font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Orange
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card px-3 py-2">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground truncate">
            Needs Improvement
          </p>
          <p className="mt-1 text-sm font-semibold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Red
          </p>
        </div>
      </div>
    </GlassCard>
  )
}

