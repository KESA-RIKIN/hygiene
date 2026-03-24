import { Activity, BarChart3, ShieldCheck } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BorderBeam } from "@/components/ui/border-beam"

const Stat = ({
  label,
  value,
  grad,
}: {
  label: string
  value: string
  grad: string
}) => {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-2xl font-semibold tracking-tight bg-gradient-to-r bg-clip-text text-transparent", grad)}>{value}</p>
    </div>
  )
}

export function Hero195() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm">
      <BorderBeam
        size={240}
        duration={12}
        borderWidth={1.5}
        colorFrom="#22d3ee"
        colorTo="#a855f7"
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative grid gap-6 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs text-foreground/80">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Analytics Overview
          </div>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
            AI‑Powered Hygiene Compliance Monitoring
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A dark‑neon dashboard foundation powered by shadcn/ui primitives, Radix UI,
            and Tailwind. Use this hero section as the new premium header for your analytics pages.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button className="bg-primary text-primary-foreground">
              View Live Monitor
            </Button>
            <Button variant="outline">
              Download Report
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Hygiene Score" value="87" grad="from-emerald-400 to-green-500" />
            <Stat label="Open Alerts" value="2" grad="from-yellow-400 to-orange-500" />
            <Stat label="Critical" value="1" grad="from-red-500 to-pink-500" />
          </div>
        </div>

        <div className="relative">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full bg-muted border border-border">
              <TabsTrigger value="overview">
                Overview
              </TabsTrigger>
              <TabsTrigger value="detections">
                Detections
              </TabsTrigger>
              <TabsTrigger value="alerts">
                Alerts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-3">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Live Compliance Signals
                  </CardTitle>
                  <CardDescription>
                    Smooth, glassy UI blocks with neon gradients for analytics.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Trend
                    </p>
                    <p className="mt-2 text-sm text-foreground/90">
                      Stable improvements across stations with minor variance.
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Model
                    </p>
                    <p className="mt-2 text-sm text-foreground/90">
                      PPE + hand hygiene + surface cleanliness classifiers.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="detections" className="mt-3">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    Detection Pipeline
                  </CardTitle>
                  <CardDescription>
                    Frame capture → inference → scoring → alert workflow.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Latency
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                      320ms
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Confidence
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                      0.93
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="mt-3">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Alert Triage
                  </CardTitle>
                  <CardDescription>
                    Prioritize corrective actions by severity and station.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Major
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                      1
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Minor
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                      3
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

