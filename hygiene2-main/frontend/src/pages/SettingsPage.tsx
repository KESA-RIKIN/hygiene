import { useState } from 'react'
import { ToggleSwitch } from '../components/ToggleSwitch'
import { GlassCard } from '../components/GlassCard'
import { Page } from '../components/Page'

export function SettingsPage() {
  const [screenshotInterval, setScreenshotInterval] = useState<5 | 10 | 15>(10)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [minorPenalty, setMinorPenalty] = useState(2)
  const [majorPenalty, setMajorPenalty] = useState(8)

  return (
    <Page className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure monitoring frequency, alerts, and penalty rules.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard className="p-5">
          <h2 className="text-lg font-semibold text-foreground">
            Monitoring options
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Control how often frames are captured for analysis.
          </p>

          <label className="mt-5 block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              Screenshot interval
            </span>
            <select
              value={screenshotInterval}
              onChange={(e) =>
                setScreenshotInterval(Number(e.target.value) as 5 | 10 | 15)
              }
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
            >
              <option value={5}>Every 5 minutes</option>
              <option value={10}>Every 10 minutes</option>
              <option value={15}>Every 15 minutes</option>
            </select>
          </label>

          <div className="mt-5 grid gap-3">
            <ToggleSwitch
              label="Email notifications"
              description="Send an email when violations are detected."
              checked={emailEnabled}
              onChange={setEmailEnabled}
            />
            <ToggleSwitch
              label="SMS notifications"
              description="Send SMS for major violations."
              checked={smsEnabled}
              onChange={setSmsEnabled}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="text-lg font-semibold text-foreground">Penalty rules</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Adjust score deductions based on severity.
          </p>

          <div className="mt-5 grid gap-4">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Minor penalty (points)
              </span>
              <input
                type="number"
                value={minorPenalty}
                onChange={(e) => setMinorPenalty(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                min={0}
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Major penalty (points)
              </span>
              <input
                type="number"
                value={majorPenalty}
                onChange={(e) => setMajorPenalty(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                min={0}
              />
            </label>

            <div className="rounded-2xl border border-border bg-card p-4 text-sm text-foreground">
              <p className="font-semibold text-foreground">Preview</p>
              <p className="mt-2">
                - Minor violations reduce score by{' '}
                <span className="font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  {minorPenalty}
                </span>{' '}
                points.
              </p>
              <p className="mt-1">
                - Major violations reduce score by{' '}
                <span className="font-semibold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  {majorPenalty}
                </span>{' '}
                points.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Values are stored in component state for this demo.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </Page>
  )
}

