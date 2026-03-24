import { useEffect, useMemo, useState } from 'react'
import { Filter, RefreshCcw, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Page } from '../components/Page'
import { GlassCard } from '../components/GlassCard'
import { StatusBadge } from '../components/StatusBadge'
// import { mockAlerts } from '../data/mockData'
import type { HygieneAlert, HygieneStatus } from '../types'

const BACKEND = 'http://localhost:8000'

interface DbAlert {
  id: number
  violation_type: string
  timestamp: string
  status: string
  image_url?: string | null
  hairnet: number
  gloves: number
}

function dbViolationToAlert(v: DbAlert): HygieneAlert & { rawId: number; imageUrl?: string | null } {
  const statusMap: Record<string, HygieneStatus> = {
    pending_review: 'warning',
    confirmed_violation: 'violation',
    resolved: 'compliant',
    open: 'violation',
    rechecking: 'warning',
  }
  const label = v.violation_type === 'missing_gloves' ? 'Missing Gloves' :
    v.violation_type === 'missing_hairnet' ? 'Missing Hairnet' :
      v.violation_type.replace(/_/g, ' ')
  return {
    id: `DB-${v.id}`,
    rawId: v.id,
    area: 'Prep Station A',
    timestamp: new Date(v.timestamp).toLocaleString(),
    status: statusMap[v.status] ?? 'warning',
    description: `Violation detected: ${label}`,
    violations: [label],
    resolved: v.status === 'resolved',
    imageUrl: v.image_url ?? null,
  }
}

export function AlertsPage() {
  const [alerts, setAlerts] = useState<(HygieneAlert & { rawId?: number; imageUrl?: string | null })[]>([])
  const [showResolved, setShowResolved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recheckingId, setRecheckingId] = useState<string | null>(null)
  const [recheckResults, setRecheckResults] = useState<Record<string, { score: number; confirmed: boolean }>>({})
  const [latestScore, setLatestScore] = useState<number | null>(null)

  const fetchAlerts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND}/api/v1/alerts?limit=30`)
      if (res.ok) {
        const data = await res.json()
        const dbAlerts = (data.alerts ?? []).map(dbViolationToAlert)
        setAlerts(dbAlerts)
      }
    } catch {
      // Backend offline — use mock data
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAlerts() }, [])

  const visibleAlerts = useMemo(() =>
    showResolved ? alerts : alerts.filter((a) => !a.resolved),
    [alerts, showResolved]
  )

  const submitCorrection = async (id: string) => {
    const a = alerts.find(x => x.id === id)
    if (a?.rawId) {
      try { await fetch(`${BACKEND}/api/v1/alerts/${a.rawId}/resolve`, { method: 'POST' }) } catch { }
    }
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, resolved: true, status: 'compliant' } : a))
  }

  const requestRecheck = async (id: string) => {
    const a = alerts.find(x => x.id === id)
    if (!a?.rawId) return
    setRecheckingId(id)
    try {
      const res = await fetch(`${BACKEND}/api/v1/alerts/${a.rawId}/recheck`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        const confirmed = data.still_violating === true
        const newScore = data.score_int ?? data.score ?? null
        setRecheckResults(prev => ({ ...prev, [id]: { score: newScore, confirmed } }))
        if (newScore !== null) setLatestScore(newScore)
        setAlerts(prev => prev.map(x =>
          x.id === id
            ? { ...x, status: confirmed ? 'violation' : 'compliant', resolved: !confirmed }
            : x
        ))
      }
    } finally {
      setRecheckingId(null)
    }
  }

  const clearAllAlerts = async () => {
    if (!window.confirm("Are you sure you want to delete all alert history? This will reset the notification count to 0.")) return
    try {
      const res = await fetch(`${BACKEND}/api/v1/alerts`, { method: 'DELETE' })
      if (res.ok) {
        setAlerts([])
        setLatestScore(100)
      }
    } catch {
      alert("Failed to clear alerts.")
    }
  }

  return (
    <Page className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Alerts</h1>
            {alerts.filter(a => !a.resolved).length > 0 && (
              <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 px-2 text-[12px] font-bold text-white shadow-lg animate-bounce">
                {alerts.filter(a => !a.resolved).length}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Review, re-check, and resolve hygiene violation alerts.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {latestScore !== null && (
            <div className="inline-flex items-center gap-2 rounded-xl border border-amber-400 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
              Updated Score: {latestScore} / 100
            </div>
          )}
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
            onClick={() => setShowResolved((s) => !s)}
          >
            <Filter className="h-4 w-4" />
            {showResolved ? 'Showing all' : 'Showing open only'}
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-500/20"
            onClick={clearAllAlerts}
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm"
            onClick={fetchAlerts}
            disabled={loading}
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Alerts'}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        <div className="space-y-4">
          {visibleAlerts.length === 0 && (
            <GlassCard className="p-8 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500 mb-3" />
              <p className="font-semibold text-foreground">All clear!</p>
              <p className="mt-1 text-sm text-muted-foreground">No open alerts at this time.</p>
            </GlassCard>
          )}

          {visibleAlerts.map((alert) => {
            const badgeGradient =
              alert.status === 'compliant' ? 'from-emerald-400 to-green-500' :
                alert.status === 'warning' ? 'from-yellow-400 to-orange-500' :
                  alert.status === 'violation' ? 'from-red-500 to-pink-500' :
                    'from-purple-500 to-cyan-400'

            const recheckResult = recheckResults[alert.id]
            const imageUrl = (alert as any).imageUrl
            const fullImageUrl = imageUrl ? `${BACKEND}${imageUrl}` : null

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                layout
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <GlassCard className="p-4">
                  {/* Header */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {alert.area}
                          <span className="ml-2 text-xs font-medium text-muted-foreground">{alert.id}</span>
                        </p>
                        <StatusBadge status={alert.status} />
                        <span className={`inline-flex items-center rounded-full border border-border bg-gradient-to-r ${badgeGradient} px-2.5 py-0.5 text-xs font-semibold text-slate-900`}>
                          {alert.status.toUpperCase()}
                        </span>
                        {alert.resolved && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Resolved
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{alert.timestamp}</p>
                      <p className="mt-3 text-sm text-foreground">{alert.description}</p>

                      {/* Re-check result feedback */}
                      {recheckResult && (
                        <div className={`mt-2 rounded-lg px-3 py-2 text-xs font-semibold ${recheckResult.confirmed
                          ? 'bg-red-100 text-red-700'
                          : 'bg-emerald-100 text-emerald-700'
                          }`}>
                          {recheckResult.confirmed
                            ? `⚠ Violation confirmed — Score updated to ${recheckResult.score}`
                            : `✓ Cleared — No violation found. Score: ${recheckResult.score}`}
                        </div>
                      )}
                    </div>

                    {/* Status Icon */}
                    <div className="grid w-full max-w-sm grid-cols-1 gap-2 sm:w-40">
                      <div className="flex h-full flex-col justify-center rounded-2xl border border-border bg-card p-4 text-center">
                        {alert.resolved ? (
                          <div className="flex flex-col items-center gap-2 text-emerald-600">
                            <div className="rounded-full bg-emerald-500/10 p-3">
                              <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <span className="text-sm font-semibold tracking-tight">Resolved</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-amber-600">
                            <div className="rounded-full bg-amber-500/10 p-3">
                              <AlertCircle className="h-8 w-8" />
                            </div>
                            <span className="text-sm font-semibold tracking-tight">Pending Review</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Violation Snapshot Image */}
                  {fullImageUrl && (
                    <div className="mt-4 rounded-2xl border border-border bg-card overflow-hidden">
                      <p className="px-3 pt-3 text-xs uppercase tracking-widest text-muted-foreground">Violation Snapshot</p>
                      <div className="mt-2 flex items-center justify-center min-h-[120px] bg-muted/30">
                        <img
                          src={fullImageUrl}
                          alt="Violation snapshot"
                          className="max-h-52 w-full object-contain rounded-b-2xl"
                          onError={(e) => {
                            const parent = (e.target as HTMLImageElement).closest('div')!
                            parent.innerHTML = `<div class="flex flex-col items-center gap-2 py-8 text-muted-foreground"><svg xmlns='http://www.w3.org/2000/svg' class='h-8 w-8' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='2' y='3' width='20' height='14' rx='2'/><path d='m8 21 4-4 4 4'/></svg><span class='text-xs'>Image not available</span></div>`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Violations */}
                  {alert.violations.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-border bg-card p-3">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Violations</p>
                      <ul className="mt-2 space-y-1">
                        {alert.violations.map((v) => (
                          <li key={v} className="text-sm text-foreground">
                            <span className={`mr-2 inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-r ${badgeGradient}`} />
                            {v}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  {!alert.resolved && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50"
                        onClick={() => requestRecheck(alert.id)}
                        disabled={recheckingId === alert.id}
                      >
                        {recheckingId === alert.id ? (
                          <>
                            <RefreshCcw className="h-3.5 w-3.5 animate-spin" />
                            Running Re-check...
                          </>
                        ) : (
                          <>
                            <RefreshCcw className="h-3.5 w-3.5" />
                            Re-Check Now
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm"
                        onClick={() => submitCorrection(alert.id)}
                      >
                        Mark Resolved
                      </motion.button>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </AnimatePresence>
    </Page >
  )
}
