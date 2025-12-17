import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, FileText } from "lucide-react"
import type { RFP } from "@/lib/mock-data"

interface DashboardSectionProps {
  rfps: RFP[]
}

export function DashboardSection({ rfps }: DashboardSectionProps) {
  const totalValue = rfps.reduce((sum, rfp) => sum + rfp.pricing.totalCost, 0)
  const avgProcessingTime = rfps.reduce((sum, rfp) => sum + rfp.processingTime, 0) / rfps.length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">RFP Dashboard</h2>
        <p className="text-sm text-muted-foreground">Overview of processed RFPs and metrics</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total RFPs</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{rfps.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="mt-1 text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Processing</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{avgProcessingTime.toFixed(1)}s</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RFP List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    RFP Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Total Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Processing Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {rfps.map((rfp, index) => (
                  <tr key={index} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{rfp.name}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{rfp.client}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{rfp.date}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          rfp.status === "completed" ? "default" : rfp.status === "pending" ? "secondary" : "outline"
                        }
                        className="capitalize"
                      >
                        {rfp.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      ${rfp.pricing.totalCost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{rfp.processingTime}s</td>
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
