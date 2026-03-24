import { Lock, Mail, ShieldCheck } from 'lucide-react'
import React, { useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
} from 'framer-motion'

const AUTH_KEY = 'hcm_authed_v1'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const gridOffsetX = useMotionValue(0)
  const gridOffsetY = useMotionValue(0)

  const speedX = 0.5
  const speedY = 0.5

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get()
    const currentY = gridOffsetY.get()
    gridOffsetX.set((currentX + speedX) % 40)
    gridOffsetY.set((currentY + speedY) % 40)
  })

  const maskImage = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, black, transparent)`

  const fromPath =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
    '/dashboard'

  const doLogin = () => {
    localStorage.setItem(AUTH_KEY, '1')
    navigate(fromPath, { replace: true })
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background text-foreground"
      )}
    >
      {/* Background Grids */}
      <div className="absolute inset-0 z-0 opacity-[0.05]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      <motion.div
        className="absolute inset-0 z-0 opacity-40"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>

      {/* Decorative Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute right-[-20%] top-[-20%] h-[40%] w-[40%] rounded-full bg-orange-500/40 blur-[120px] dark:bg-orange-600/20" />
        <div className="absolute right-[10%] top-[-10%] h-[20%] w-[20%] rounded-full bg-primary/30 blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[40%] w-[40%] rounded-full bg-blue-500/40 blur-[120px] dark:bg-blue-600/20" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-6xl px-4 py-10 pointer-events-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left panel info */}
          <div className="rounded-3xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  AI-Powered Hygiene
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Compliance Monitoring System
                </h1>
              </div>
            </div>

            <p className="mt-5 text-sm text-muted-foreground">
              Monitor hygiene compliance across stations with AI-assisted checks,
              live alerts, and reporting.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card/60 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Detection
                </p>
                <p className="mt-2 text-sm text-foreground">
                  Gloves, hairnets, hand hygiene
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Alerts
                </p>
                <p className="mt-2 text-sm text-foreground">
                  Actionable violations with re-check flow
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Reporting
                </p>
                <p className="mt-2 text-sm text-foreground">
                  Daily and weekly performance views
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Admin
                </p>
                <p className="mt-2 text-sm text-foreground">
                  Thresholds, penalties, notifications
                </p>
              </div>
            </div>
          </div>

          {/* Right panel login */}
          <div className="rounded-3xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">Sign in</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Use demo credentials or your manager account.
            </p>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  Email
                </span>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="manager@restaurant.com"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  Password
                </span>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </label>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm"
                  onClick={doLogin}
                >
                  Login
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                  onClick={() => {
                    setEmail('demo.manager@horizon-kitchen.com')
                    setPassword('demo1234')
                    doLogin()
                  }}
                >
                  Login as Demo Manager
                </motion.button>
              </div>

              <p className="text-xs text-muted-foreground">
                This is a frontend-only demo. Authentication is mocked.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const GridPattern = ({ offsetX, offsetY }: { offsetX: any; offsetY: any }) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id="grid-pattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  )
}
