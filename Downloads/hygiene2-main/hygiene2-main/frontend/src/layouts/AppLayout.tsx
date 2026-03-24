import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sidebar } from '../components/Sidebar'
import { TopNavbar } from '../components/TopNavbar'

export function AppLayout() {
  return (
    <div className="relative min-h-screen text-foreground bg-background">
      {/* Grid Pattern Background */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-repeat bg-[length:30px_30px] bg-grid-pattern-light dark:bg-grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-tr from-background/90 via-background/40 to-background/10" />
      </div>

      <motion.div
        className="relative z-10 flex min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <TopNavbar />
          <main className="flex-1 px-4 py-6 md:px-6">
            <Outlet />
          </main>
        </div>
      </motion.div>
    </div>
  )
}

