import type { PropsWithChildren } from 'react'

interface GlassCardProps extends PropsWithChildren {
  className?: string
}

export function GlassCard({ className, children }: GlassCardProps) {
  return (
    <div
      className={[
        'rounded-2xl border border-border bg-card text-card-foreground shadow-sm',
        'transition-all duration-300 hover:shadow-md',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </div>
  )
}

