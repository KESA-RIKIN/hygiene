import { Camera as CameraIcon, Cpu, Sparkles, VideoOff, Video, RefreshCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import { GlassCard } from '../components/GlassCard'
import { Page } from '../components/Page'
import Camera from '../components/Camera' // ✅ ADD THIS
import type { HygieneStatus } from '../types'

const BACKEND = 'http://localhost:8000'
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
          Camera preview (no detection mode).
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Camera</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                Local Camera Feed
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={status} />
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-xs text-foreground">
                <Sparkles className="h-4 w-4 text-neutral" />
                Camera Mode
              </div>
            </div>
          </div>

          {/* ✅ REPLACED VIDEO WITH CAMERA */}
          <motion.div className="mt-4 rounded-2xl border border-border bg-card overflow-hidden p-4">
            {isStreaming ? (
              <Camera />
            ) : (
              <div className="text-center py-16">
                <VideoOff className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">Camera Off</p>
              </div>
            )}
          </motion.div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="px-3 py-2 text-xs bg-gray-200 rounded"
              onClick={captureFrame}
            >
              📸 Capture
            </button>

            <button
              className={`px-3 py-2 text-xs rounded ${
                isStreaming ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}
              onClick={toggleCamera}
            >
              {isStreaming ? 'Stop Camera' : 'Start Camera'}
            </button>
          </div>
        </GlassCard>
      </div>
    </Page>
  )
}
