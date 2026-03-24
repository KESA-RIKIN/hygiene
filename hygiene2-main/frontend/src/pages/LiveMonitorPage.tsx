import { Camera, Cpu, Sparkles, VideoOff, Video, RefreshCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import { GlassCard } from '../components/GlassCard'
import { Page } from '../components/Page'
import type { HygieneStatus } from '../types'

const BACKEND = 'http://localhost:8000'
const STREAM_URL = `${BACKEND}/api/v1/live/video`
const STATUS_URL = `${BACKEND}/api/v1/live/status`

function statusFromScore(score: number): HygieneStatus {
  if (score >= 90) return 'compliant'
  if (score >= 60) return 'warning'
  return 'violation'
}

function humanViolation(v: string): string {
  if (v === 'missing_gloves') return 'Missing Gloves'
  if (v === 'missing_hairnet') return 'Missing Hairnet'
  return v.replace(/_/g, ' ')
}

export function LiveMonitorPage() {
  const navigate = useNavigate()
  const [isStreaming, setIsStreaming] = useState(true)
  const [score, setScore] = useState(80)
  const [violations, setViolations] = useState<string[]>([])
  const [frameCount, setFrameCount] = useState(0)
  const [isAlert, setIsAlert] = useState(false)
  const [backendOnline, setBackendOnline] = useState(true)
  const [capturedAt, setCapturedAt] = useState<string | null>(null)
  const [pendingAlerts, setPendingAlerts] = useState(0)
  const [hairnetOk, setHairnetOk] = useState(true)
  const [glovesOk, setGlovesOk] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const status: HygieneStatus = statusFromScore(score)

  // Poll /live/status every 1.5 seconds when streaming
  useEffect(() => {
    if (!isStreaming) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    const poll = async () => {
      try {
        const res = await fetch(STATUS_URL)
        if (!res.ok) throw new Error('bad response')
        const data = await res.json()
        setScore(data.score_int ?? data.score ?? 80)
        setViolations(data.violations ?? [])
        setIsAlert(data.is_alert ?? false)
        setFrameCount(data.frame_count ?? 0)
        setPendingAlerts(data.pending_alerts ?? 0)
        setHairnetOk(data.hairnet_ok ?? true)
        setGlovesOk(data.gloves_ok ?? true)
        setBackendOnline(true)
      } catch {
        setBackendOnline(false)
      }
    }

    poll()
    intervalRef.current = setInterval(poll, 1500)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isStreaming])

  const toggleCamera = () => setIsStreaming((s) => !s)

  const captureFrame = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setCapturedAt(`Captured at ${time}`)
    setTimeout(() => setCapturedAt(null), 3000)
  }

  const runComplianceCheck = () => {
    // Navigate to alerts if there's an active alert
    if (isAlert || violations.length > 0) {
      navigate('/alerts')
    }
  }

  return (
    <Page className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Live Monitor
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time AI hygiene compliance camera feed.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Camera</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                Prep Station A • Feed 01
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={status} />
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-xs text-foreground">
                <Sparkles className="h-4 w-4 text-neutral" />
                Live AI
              </div>
            </div>
          </div>

          {/* Video Feed */}
          <motion.div
            className="mt-4 relative rounded-2xl border border-border bg-card overflow-hidden min-h-[240px] flex items-center justify-center"
            animate={{
              boxShadow: isStreaming
                ? ['0 0 0px rgba(2,6,23,0.0)', '0 8px 24px rgba(2,6,23,0.10)', '0 0 0px rgba(2,6,23,0.0)']
                : '0 0 0px rgba(2,6,23,0.0)',
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {isStreaming ? (
              <img
                src={STREAM_URL}
                alt="Live video feed"
                className="w-full h-auto object-contain max-h-[500px]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  setBackendOnline(false)
                }}
              />
            ) : (
              <div className="text-center py-16">
                <VideoOff className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">Camera Off</p>
                <p className="mt-1 text-xs text-muted-foreground">Click Start Camera to resume monitoring</p>
              </div>
            )}

            {/* Backend offline overlay */}
            {isStreaming && !backendOnline && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">Video feed offline</p>
                  <p className="mt-1 text-xs text-muted-foreground">Backend not reachable — start the server</p>
                </div>
              </div>
            )}

            {/* Violation banner overlay */}
            <AnimatePresence>
              {isStreaming && violations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-3 left-3 right-3"
                >
                  <div className="rounded-xl bg-amber-500/90 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
                    ⚠ Violation Detected — Sent to Review ({violations.map(humanViolation).join(', ')})
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pending alerts badge */}
            <AnimatePresence>
              {pendingAlerts > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute bottom-3 right-3"
                >
                  <button
                    type="button"
                    onClick={() => navigate('/alerts')}
                    className="rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg hover:bg-amber-600"
                  >
                    🔔 {pendingAlerts} pending review{pendingAlerts > 1 ? 's' : ''}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Capture flash feedback */}
            <AnimatePresence>
              {capturedAt && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-3 left-3 right-3 text-center text-xs text-white bg-black/60 rounded-lg py-1.5"
                >
                  📸 {capturedAt}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
              onClick={captureFrame}
              disabled={!isStreaming}
            >
              <Camera className="h-4 w-4" />
              Capture Frame
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm"
              onClick={runComplianceCheck}
            >
              <Cpu className="h-4 w-4" />
              {isAlert || violations.length > 0 ? 'View Violation Alert' : 'Run Compliance Check'}
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold shadow-sm transition-colors ${isStreaming
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              onClick={toggleCamera}
            >
              {isStreaming ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
              {isStreaming ? 'Stop Camera' : 'Start Camera'}
            </motion.button>
          </div>
        </GlassCard>

        {/* Right Panel */}
        <div className="space-y-4">
          <GlassCard className="p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Detection results</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">Live analysis</h2>

            <div className="mt-4 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Trust Score</p>
                <div className="inline-flex items-center gap-2">
                  <motion.span
                    className={`h-2.5 w-2.5 rounded-full ${isStreaming ? 'bg-primary' : 'bg-muted-foreground'}`}
                    animate={isStreaming ? { scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] } : {}}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <StatusBadge status={status} />
                </div>
              </div>
              <p className="mt-2 text-4xl font-bold text-foreground">
                {score}
                <span className="text-sm text-muted-foreground"> / 100</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {isStreaming ? `Frame ${frameCount} • Live` : 'Camera stopped'}
              </p>

              {/* Score bar */}
              <div className="mt-3">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Compliance progress</p>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <motion.div
                    className={`h-2 rounded-full transition-colors ${status === 'compliant' ? 'bg-emerald-500' :
                      status === 'warning' ? 'bg-amber-400' : 'bg-red-500'
                      }`}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Violations */}
              <div className="mt-3">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Active violations</p>
                {violations.length > 0 ? (
                  <ul className="mt-2 space-y-1">
                    {violations.map((v) => (
                      <li key={v} className="text-sm text-red-600 font-medium">
                        <span className="mr-2">•</span>
                        {humanViolation(v)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-emerald-600 font-medium">✓ No violations detected</p>
                )}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Current shift</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">Hygiene score</h2>
            <p className="mt-3 text-4xl font-bold text-foreground">
              {score}
              <span className="text-sm text-muted-foreground"> / 100</span>
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-border bg-card p-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Gloves</p>
                <p className={`mt-1 text-lg font-semibold ${!glovesOk ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {!glovesOk ? '⏳ Review' : 'OK'}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Hairnet</p>
                <p className={`mt-1 text-lg font-semibold ${!hairnetOk ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {!hairnetOk ? '⏳ Review' : 'OK'}
                </p>
              </div>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
              onClick={() => navigate('/alerts')}
            >
              <RefreshCcw className="h-4 w-4" />
              View All Alerts
            </motion.button>
          </GlassCard>
        </div>
      </div>
    </Page>
  )
}
