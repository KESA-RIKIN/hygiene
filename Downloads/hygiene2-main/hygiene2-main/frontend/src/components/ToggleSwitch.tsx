import React from 'react'

interface ToggleSwitchProps {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
  description?: string
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  checked,
  onChange,
  description,
}) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:-translate-y-[1px]"
    >
      <div>
        <p className="text-sm font-medium text-gray-100">{label}</p>
        {description ? (
          <p className="mt-0.5 text-xs text-gray-400">{description}</p>
        ) : null}
      </div>
      <span
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          checked ? 'bg-gradient-to-r from-purple-500 to-cyan-400' : 'bg-white/15'
        }`}
        aria-hidden="true"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
            checked ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </span>
    </button>
  )
}

