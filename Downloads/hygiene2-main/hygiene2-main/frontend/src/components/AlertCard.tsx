import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { HygieneAlert } from '../types'
import { StatusBadge } from './StatusBadge'
import { GlassCard } from './GlassCard'

interface AlertCardProps {
  alert: HygieneAlert
  showActions?: boolean
  onSubmitCorrection?: (id: string, fixes: string[]) => void
  onRequestRecheck?: (id: string) => void
}

export function AlertCard({
  alert,
  showActions = false,
  onSubmitCorrection,
  onRequestRecheck,
}: AlertCardProps) {
  const [glovesFixed, setGlovesFixed] = useState(false)
  const [floorCleaned, setFloorCleaned] = useState(false)

  const selectedFixes = useMemo(() => {
    const fixes: string[] = []
    if (glovesFixed) fixes.push('Gloves Fixed')
    if (floorCleaned) fixes.push('Floor Cleaned')
    return fixes
  }, [glovesFixed, floorCleaned])

  const badgeGradient =
    alert.status === 'compliant'
      ? 'from-emerald-400 to-green-500'
      : alert.status === 'warning'
        ? 'from-yellow-400 to-orange-500'
        : alert.status === 'violation'
          ? 'from-red-500 to-pink-500'
          : 'from-purple-500 to-cyan-400'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      layout
    >
      <GlassCard className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-foreground">
                {alert.area}
                <span className="ml-2 text-xs font-medium text-muted-foreground">
                  {alert.id}
                </span>
              </p>
              <StatusBadge status={alert.status} />
              <span
                className={`inline-flex items-center rounded-full border border-border bg-gradient-to-r ${badgeGradient} px-2.5 py-0.5 text-xs font-semibold text-slate-900`}
              >
                {alert.status.toUpperCase()}
              </span>
              <AnimatePresence initial={false}>
                {alert.resolved ? (
                  <motion.span
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-emerald-700"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Resolved
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{alert.timestamp}</p>
            <p className="mt-3 text-sm text-foreground">{alert.description}</p>
          </div>

          <div className="grid w-full max-w-sm grid-cols-1 gap-2 sm:w-48">
            <div className="flex h-full flex-col justify-center rounded-2xl border border-border bg-card p-4 text-center">
              {alert.resolved ? (
                <div className="flex flex-col items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <div className="rounded-full bg-emerald-500/10 p-3">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight">Resolved</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-amber-600 dark:text-amber-400">
                  <div className="rounded-full bg-amber-500/10 p-3">
                    <AlertCircle className="h-8 w-8" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight">Requires Action</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Violations
            </p>
            <ul className="mt-2 space-y-1">
              {alert.violations.map((v) => (
                <li key={v} className="text-sm text-foreground">
                  <span className={`mr-2 inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-r ${badgeGradient}`} />
                  {v}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Correction checklist
            </p>
            <div className="mt-2 space-y-2">
              {alert.resolved ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    {glovesFixed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={glovesFixed ? "" : "text-muted-foreground"}>Gloves Fixed</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    {floorCleaned ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={floorCleaned ? "" : "text-muted-foreground"}>Floor Cleaned</span>
                  </div>
                </>
              ) : (
                <>
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border bg-background cursor-pointer"
                      checked={glovesFixed}
                      onChange={(e) => setGlovesFixed(e.target.checked)}
                    />
                    Gloves Fixed
                  </label>
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border bg-background cursor-pointer"
                      checked={floorCleaned}
                      onChange={(e) => setFloorCleaned(e.target.checked)}
                    />
                    Floor Cleaned
                  </label>
                </>
              )}
            </div>

            {showActions ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm"
                  onClick={() => onSubmitCorrection?.(alert.id, selectedFixes)}
                >
                  Submit Correction
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                  onClick={() => onRequestRecheck?.(alert.id)}
                >
                  Request Re-Check
                </motion.button>
              </div>
            ) : null}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

