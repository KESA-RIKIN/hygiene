import { Moon, ShieldCheck, SunMedium, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { mockHygieneScore } from '../data/mockData'
import { useTheme } from './ThemeProvider'

const AUTH_KEY = 'hcm_authed_v1'

export function TopNavbar() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const score = mockHygieneScore

  const scoreTone =
    score >= 85 ? 'success' : score >= 70 ? 'warning' : 'critical'

  const badge =
    scoreTone === 'success'
      ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200'
      : scoreTone === 'warning'
        ? 'bg-orange-500/10 text-orange-700 border-orange-200'
        : 'bg-rose-500/10 text-rose-700 border-rose-200'

  return (
    <motion.header
      className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur md:px-6"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-3">
        <div className="hidden rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground sm:inline-flex">
          <ShieldCheck className="mr-1 h-3.5 w-3.5" />
          AI Guard • Live
        </div>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Restaurant
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Horizon Kitchen • Downtown
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-1.5">
          <div className="flex flex-col items-end leading-tight">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Hygiene score
            </span>
            <span className="text-base font-semibold text-foreground">
              {score}
              <span className="text-xs text-muted-foreground"> / 100</span>
            </span>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${badge}`}
          >
            {scoreTone === 'success' ? 'GOOD' : scoreTone === 'warning' ? 'MEDIUM' : 'NEEDS IMPROVEMENT'}
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            HM
          </div>
          <div className="hidden text-xs leading-tight text-muted-foreground sm:block">
            <p className="font-medium">Helena Meyer</p>
            <p className="text-[11px] text-muted-foreground">Hygiene Manager</p>
          </div>
          <User className="h-3.5 w-3.5 text-muted-foreground" />
        </div>

        <button
          type="button"
          className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
          onClick={() => {
            localStorage.removeItem(AUTH_KEY)
            navigate('/login', { replace: true })
          }}
        >
          Logout
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-muted"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <SunMedium className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </div>
    </motion.header>
  )
}

