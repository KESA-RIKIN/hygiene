import type { HygieneStatus } from '../types'

const STATUS_STYLES: Record<
  HygieneStatus,
  { grad: string; label: string; dot: string }
> = {
  compliant: {
    grad: 'from-emerald-400 to-green-500',
    dot: 'bg-emerald-300',
    label: 'Compliant',
  },
  warning: {
    grad: 'from-yellow-400 to-orange-500',
    dot: 'bg-yellow-300',
    label: 'Warning',
  },
  violation: {
    grad: 'from-red-500 to-pink-500',
    dot: 'bg-rose-300',
    label: 'Violation',
  },
  neutral: {
    grad: 'from-purple-500 to-cyan-400',
    dot: 'bg-cyan-300',
    label: 'Neutral',
  },
}

interface StatusBadgeProps {
  status: HygieneStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_STYLES[status]

  return (
    <span
      className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-gray-100 backdrop-blur-xl"
    >
      <span className={`mr-2 h-1.5 w-1.5 rounded-full ${config.dot}`} />
      <span className={`bg-gradient-to-r ${config.grad} bg-clip-text text-transparent`}>
        {config.label}
      </span>
    </span>
  )
}

