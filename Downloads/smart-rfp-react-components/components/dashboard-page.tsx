"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Clock, Target, FileText } from "lucide-react"
import { recentRfps, activityFeed } from "@/lib/mock-data"

export function DashboardPage() {
  const metrics = [
    { label: "Open RFPs", value: "12", icon: Target, color: "text-primary" },
    { label: "RFPs Due in <7 Days", value: "5", icon: Clock, color: "text-destructive/80" },
    {
      label: "On-Time Response Rate",
      value: "90%",
      subtitle: "vs 60% baseline",
      icon: TrendingUp,
      color: "text-chart-2",
    },
    { label: "Win Rate (This Quarter)", value: "68%", icon: Target, color: "text-chart-3" },
  ]

  const pipelineStages = [
    { stage: "Identified", count: 18 },
    { stage: "Qualified", count: 12 },
    { stage: "In Technical Review", count: 8 },
    { stage: "Priced", count: 5 },
    { stage: "Submitted", count: 3 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Actioned":
        return "bg-destructive/10 text-destructive"
      case "In Progress":
        return "bg-chart-1/10 text-chart-1"
      case "Qualified":
        return "bg-chart-2/10 text-chart-2"
      case "Technical Review":
        return "bg-chart-3/10 text-chart-3"
      case "Pricing":
        return "bg-chart-4/10 text-chart-4"
      case "Priced":
        return "bg-chart-5/10 text-chart-5"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-foreground">Welcome to SmartRFP</h2>
          <p className="mt-2 text-balance text-muted-foreground">
            SmartRFP uses <span className="font-semibold text-foreground">multi-agent AI architecture</span> to automate
            your RFP workflow. Three specialized agents – <span className="font-semibold text-primary">Sales</span>,{" "}
            <span className="font-semibold text-chart-3">Technical</span>, and{" "}
            <span className="font-semibold text-chart-4">Pricing</span> – work together to identify tenders, match
            specifications, and generate proposals faster than manual processes.
          </p>
        </CardContent>
      </Card>

      {/* Top Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">{metric.value}</p>
                    {metric.subtitle && <p className="mt-1 text-xs text-muted-foreground">{metric.subtitle}</p>}
                  </div>
                  <div className={`rounded-lg bg-muted p-3 ${metric.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pipeline Funnel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>RFP Pipeline Funnel</CardTitle>
            <p className="text-sm text-muted-foreground">Visualizes bottlenecks across stages</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineStages.map((stage, index) => {
                const maxCount = pipelineStages[0].count
                const widthPercent = (stage.count / maxCount) * 100
                return (
                  <div key={stage.stage}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{stage.stage}</span>
                      <span className="font-semibold text-foreground">{stage.count} RFPs</span>
                    </div>
                    <div className="h-8 rounded-lg bg-muted">
                      <div
                        className="h-full rounded-lg bg-gradient-to-r from-primary to-primary/70 transition-all"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityFeed.slice(0, 6).map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="h-2 w-2 translate-y-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Recently Received RFPs
          </CardTitle>
          <p className="text-sm text-muted-foreground">Latest RFPs that need your attention</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm font-medium text-muted-foreground">
                  <th className="pb-3">RFP ID</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Received</th>
                  <th className="pb-3">Source</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Est. Value</th>
                  <th className="pb-3">Due Date</th>
                  <th className="pb-3">Priority</th>
                </tr>
              </thead>
              <tbody>
                {recentRfps.map((rfp) => (
                  <tr key={rfp.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 font-mono text-sm text-primary">{rfp.id}</td>
                    <td className="py-4 text-sm font-medium text-foreground">{rfp.client}</td>
                    <td className="py-4 text-sm text-muted-foreground">{rfp.receivedDate}</td>
                    <td className="py-4">
                      <Badge variant="outline" className="text-xs">
                        {rfp.source}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <Badge className={getStatusColor(rfp.status)}>{rfp.status}</Badge>
                    </td>
                    <td className="py-4 text-sm font-semibold text-foreground">{rfp.estimatedValue}</td>
                    <td className="py-4 text-sm text-muted-foreground">{rfp.dueDate}</td>
                    <td className="py-4">
                      <Badge
                        className={
                          rfp.priority === "High"
                            ? "bg-destructive/10 text-destructive"
                            : rfp.priority === "Medium"
                              ? "bg-chart-4/10 text-chart-4"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {rfp.priority}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
