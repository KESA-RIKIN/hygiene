import { NavLink } from 'react-router-dom'
import {
  Activity,
  AlertCircle,
  BarChart3,
  Camera,
  LayoutDashboard,
  MapPin,
  Settings,
} from 'lucide-react'

import { useEffect, useState } from 'react'

const BACKEND = 'http://localhost:8000'

const navLinkBase =
  'group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300'

const getNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    navLinkBase,
    isActive
      ? 'bg-accent text-foreground border-l-4 border-primary pl-2'
      : 'text-muted-foreground hover:text-foreground hover:bg-accent/60',
  ].join(' ')

export function Sidebar() {
  const [pendingAlerts, setPendingAlerts] = useState(0)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/v1/live/status`)
        if (res.ok) {
          const data = await res.json()
          setPendingAlerts(data.pending_alerts ?? 0)
        }
      } catch (err) {
        // quiet fail
      }
    }
    const interval = setInterval(fetchStatus, 3000)
    fetchStatus()
    return () => clearInterval(interval)
  }, [])
  return (
    <aside className="hidden w-72 flex-col border-r border-border bg-background px-4 py-6 md:flex">
      <div className="flex items-center gap-3 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            AI-Powered
          </p>
          <p className="text-sm font-semibold tracking-tight text-foreground">
            Hygiene Analytics
          </p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1 text-sm">
        <p className="px-1 text-xs uppercase tracking-widest text-muted-foreground">
          Overview
        </p>
        <NavLink to="/dashboard" className={getNavLinkClassName}>
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </NavLink>
        <NavLink to="/live" className={getNavLinkClassName}>
          <Camera className="h-4 w-4" />
          Live Monitor
        </NavLink>

        <p className="mt-5 px-1 text-xs uppercase tracking-widest text-muted-foreground">
          Insights
        </p>
        <NavLink to="/alerts" className={getNavLinkClassName}>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-4 w-4" />
            Alerts
          </div>
          {pendingAlerts > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white ring-2 ring-background animate-pulse">
              {pendingAlerts}
            </span>
          )}
        </NavLink>
        <NavLink to="/reports" className={getNavLinkClassName}>
          <BarChart3 className="h-4 w-4" />
          Reports
        </NavLink>
        <NavLink to="/restaurants" className={getNavLinkClassName}>
          <MapPin className="h-4 w-4" />
          Restaurants
        </NavLink>

        <p className="mt-5 px-1 text-xs uppercase tracking-widest text-muted-foreground">
          System
        </p>
        <NavLink to="/settings" className={getNavLinkClassName}>
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>
      </nav>

      <div className="mt-5 rounded-2xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Session
        </p>
        <p className="mt-2 font-medium text-foreground">Horizon Kitchen</p>
        <p>Branch A • 8 active cameras</p>
        <div className="mt-3 h-px w-full bg-border" />
        <p className="mt-3 text-[11px] text-muted-foreground">
          Tip: Use <span className="text-primary">Live Monitor</span> to run
          checks.
        </p>
      </div>
    </aside>
  )
}

