"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Clock, Target } from "lucide-react"

export function AnalyticsPage() {
  const turnaroundData = [
    { stage: "Identification", manual: 24, withAI: 0.5 },
    { stage: "Spec Matching", manual: 48, withAI: 2 },
    { stage: "Pricing", manual: 24, withAI: 1 },
    { stage: "Submission", manual: 12, withAI: 1.5 },
  ]

  const delayReasons = [
    { reason: "Late RFP identification", count: 18, impact: "High" },
    { reason: "Slow spec matching", count: 15, impact: "High" },
    { reason: "Pricing dependency on tests", count: 12, impact: "Medium" },
    { reason: "Manual handoffs between teams", count: 10, impact: "High" },
    { reason: "Excel sheet assembly", count: 8, impact: "Low" },
  ]

  const comparisonMetrics = [
    { metric: "Avg RFP Cycle Time", manual: "3 days", withAI: "5 hours", improvement: "83% faster" },
    { metric: "Win Rate", manual: "25%", withAI: "68%", improvement: "+172% increase" },
    { metric: "RFPs Handled/Month", manual: "20", withAI: "60", improvement: "3x capacity" },
    { metric: "Error Rate", manual: "12%", withAI: "2%", improvement: "83% reduction" },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Average Turnaround Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Average Turnaround Time per Stage
          </CardTitle>
          <p className="text-sm text-muted-foreground">Comparing manual process vs SmartRFP (hours)</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {turnaroundData.map((stage) => (
              <div key={stage.stage}>
                <p className="mb-2 text-sm font-semibold text-foreground">{stage.stage}</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Manual</span>
                      <span className="font-semibold text-foreground">{stage.manual}h</span>
                    </div>
                    <div className="h-8 rounded-lg bg-muted">
                      <div
                        className="h-full rounded-lg bg-muted-foreground"
                        style={{ width: `${(stage.manual / 48) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">With SmartRFP</span>
                      <span className="font-semibold text-chart-2">{stage.withAI}h</span>
                    </div>
                    <div className="h-8 rounded-lg bg-muted">
                      <div
                        className="h-full rounded-lg bg-chart-2"
                        style={{ width: `${(stage.withAI / 48) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Reasons for Delay */}
        <Card>
          <CardHeader>
            <CardTitle>Top Reasons for Delay (Manual Process)</CardTitle>
            <p className="text-sm text-muted-foreground">Bottlenecks identified in last 6 months</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left text-sm font-medium text-muted-foreground">
                    <th className="pb-3">Reason</th>
                    <th className="pb-3 text-center">Count</th>
                    <th className="pb-3 text-center">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {delayReasons.map((reason) => (
                    <tr key={reason.reason} className="border-b border-border">
                      <td className="py-3 text-sm text-foreground">{reason.reason}</td>
                      <td className="py-3 text-center text-sm font-semibold text-foreground">{reason.count}</td>
                      <td className="py-3 text-center">
                        <span
                          className={`text-xs font-semibold ${
                            reason.impact === "High"
                              ? "text-destructive"
                              : reason.impact === "Medium"
                                ? "text-destructive/80"
                                : "text-muted-foreground"
                          }`}
                        >
                          {reason.impact}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* On-Time Submission % */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-chart-2" />
              On-Time Submission Rate
            </CardTitle>
            <p className="text-sm text-muted-foreground">Last 6 months trend</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Manual Process</span>
                  <span className="text-2xl font-bold text-foreground">60%</span>
                </div>
                <div className="h-4 rounded-full bg-muted">
                  <div className="h-full w-3/5 rounded-full bg-muted-foreground" />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">With SmartRFP</span>
                  <span className="text-2xl font-bold text-chart-2">90%</span>
                </div>
                <div className="h-4 rounded-full bg-muted">
                  <div className="h-full w-[90%] rounded-full bg-chart-2" />
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-chart-2/10 p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-chart-2" />
                <p className="font-semibold text-chart-2">+50% Improvement</p>
              </div>
              <p className="mt-1 text-xs text-chart-2/80">
                SmartRFP reduces missed deadlines by identifying RFPs early and automating workflows
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Before vs After Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Before vs After SmartRFP</CardTitle>
          <p className="text-sm text-muted-foreground">Business impact across key metrics</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border text-left text-sm font-semibold text-foreground">
                  <th className="pb-3">Metric</th>
                  <th className="pb-3 text-center">Manual Process</th>
                  <th className="pb-3 text-center">With SmartRFP</th>
                  <th className="pb-3 text-center">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {comparisonMetrics.map((metric) => (
                  <tr key={metric.metric} className="border-b border-border">
                    <td className="py-4 font-medium text-foreground">{metric.metric}</td>
                    <td className="py-4 text-center text-muted-foreground">{metric.manual}</td>
                    <td className="py-4 text-center font-semibold text-primary">{metric.withAI}</td>
                    <td className="py-4 text-center">
                      <span className="inline-flex items-center gap-1 font-semibold text-chart-2">
                        <TrendingUp className="h-4 w-4" />
                        {metric.improvement}
                      </span>
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
