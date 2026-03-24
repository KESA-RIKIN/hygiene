import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Page } from '../components/Page'
import { GlassCard } from '../components/GlassCard'
import { Input } from '@/components/ui/input'

type RestaurantInfo = {
  id: string
  name: string
  score: number
  lastUpdated: string
}

const RESTAURANTS: RestaurantInfo[] = [
  { id: 'r1', name: 'Horizon Kitchen • Downtown', score: 92, lastUpdated: 'Today • 10:15' },
  { id: 'r2', name: 'Seaside Bistro • Pier 14', score: 88, lastUpdated: 'Yesterday • 19:40' },
  { id: 'r3', name: 'Urban Noodles • Midtown', score: 77, lastUpdated: 'Mon • 14:05' },
  { id: 'r4', name: 'Green Garden Cafe', score: 94, lastUpdated: 'Sun • 09:20' },
  { id: 'r5', name: 'Sunrise Diner • East', score: 69, lastUpdated: 'Sat • 21:10' },
  { id: 'r6', name: 'Cloud Nine Rooftop Bar', score: 83, lastUpdated: 'Fri • 22:30' },
]

function statusForScore(score: number) {
  if (score >= 90) return { label: 'Excellent', tone: 'success' as const }
  if (score >= 80) return { label: 'Good', tone: 'good' as const }
  if (score >= 70) return { label: 'Needs Improvement', tone: 'warn' as const }
  return { label: 'Under Review', tone: 'critical' as const }
}

export function RestaurantsPage() {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(RESTAURANTS[0]?.id ?? null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return RESTAURANTS
    return RESTAURANTS.filter((r) => r.name.toLowerCase().includes(q))
  }, [query])

  const selected = useMemo(
    () => RESTAURANTS.find((r) => r.id === selectedId) ?? filtered[0] ?? null,
    [selectedId, filtered],
  )

  const selectedStatus = selected ? statusForScore(selected.score) : null

  return (
    <Page className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Restaurant hygiene scores
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Search for a location and view its weekly AI-generated hygiene score.
          </p>
        </div>
      </div>

      <GlassCard className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="h-10 pl-9"
              placeholder="Search restaurant..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-1 p-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Results
          </p>
          <div className="mt-3 space-y-1.5">
            {filtered.map((r) => {
              const active = selected?.id === r.id
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedId(r.id)}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                    active
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border bg-background hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{r.name}</span>
                    <span className="text-xs text-muted-foreground">{r.score}%</span>
                  </div>
                </button>
              )
            })}
            {filtered.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No restaurants matched your search.
              </p>
            ) : null}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-6">
          {selected ? (
            <>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Selected restaurant
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                {selected.name}
              </h2>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Weekly hygiene score
                  </p>
                  <p className="mt-1 text-4xl font-bold text-foreground">
                    {selected.score}
                    <span className="text-sm text-muted-foreground"> %</span>
                  </p>
                </div>

                {selectedStatus ? (
                  <div className="rounded-full border border-border bg-muted px-4 py-2 text-xs font-semibold text-foreground">
                    {selectedStatus.label}
                  </div>
                ) : null}

                <div className="text-xs text-muted-foreground">
                  Last updated: {selected.lastUpdated}
                </div>
              </div>

              <p className="mt-8 text-xs text-muted-foreground">
                This view intentionally omits detailed metrics, violation logs, and CCTV feeds
                to focus on a single, easy-to-read hygiene score.
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Search and select a restaurant on the left to view its hygiene score.
            </p>
          )}

          <p className="mt-6 text-[11px] text-muted-foreground">
            This hygiene score is AI-generated based on internal compliance monitoring and does
            not replace official health inspections.
          </p>
        </GlassCard>
      </div>
    </Page>
  )
}

