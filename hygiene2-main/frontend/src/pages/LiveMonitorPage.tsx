import { VideoOff, Video } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '../components/GlassCard'
import { Page } from '../components/Page'
import Camera from '../components/Camera'

export function LiveMonitorPage() {
  const [isStreaming, setIsStreaming] = useState(true)
  const [capturedAt, setCapturedAt] = useState<string | null>(null)

  const toggleCamera = () => setIsStreaming((s) => !s)

  const captureFrame = () => {
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    setCapturedAt(`Captured at ${time}`)
    setTimeout(() => setCapturedAt(null), 3000)
  }

  return (
    <Page className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Live Monitor
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Camera preview (no detection mode)
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Camera
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                Local Camera Feed
              </h2>
            </div>
          </div>

          {/* 🎥 CAMERA */}
          <motion.div className="mt-4 rounded-2xl border border-border bg-card overflow-hidden p-4">
            {isStreaming ? (
              <Camera />
            ) : (
              <div className="text-center py-16">
                <VideoOff className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">
                  Camera Off
                </p>
              </div>
            )}
          </motion.div>

          {/* 🔘 BUTTONS */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="px-3 py-2 text-xs bg-gray-200 rounded"
              onClick={captureFrame}
            >
              📸 Capture
            </button>

            <button
              className={`px-3 py-2 text-xs rounded ${
                isStreaming
                  ? 'bg-red-500 text-white'
                  : 'bg-green-500 text-white'
              }`}
              onClick={toggleCamera}
            >
              {isStreaming ? (
                <>
                  <VideoOff className="h-4 w-4 inline mr-1" />
                  Stop Camera
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 inline mr-1" />
                  Start Camera
                </>
              )}
            </button>
          </div>

          {/* 📸 CAPTURE MESSAGE */}
          {capturedAt && (
            <div className="mt-3 text-center text-xs text-white bg-black/60 rounded-lg py-1.5">
              📸 {capturedAt}
            </div>
          )}
        </GlassCard>
      </div>
    </Page>
  )
}
