import type { PropsWithChildren } from 'react'
import { motion } from 'framer-motion'

interface PageProps extends PropsWithChildren {
  className?: string
}

export function Page({ className, children }: PageProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

