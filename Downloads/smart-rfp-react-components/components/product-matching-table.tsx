import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle } from "lucide-react"
import type { ProductMatch } from "@/lib/mock-data"

interface ProductMatchingTableProps {
  matches: ProductMatch[]
}

export function ProductMatchingTable({ matches }: ProductMatchingTableProps) {
  return (
    <div className="space-y-4">
      {matches.map((match, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="mb-4">
              <h4 className="text-base font-semibold text-foreground">{match.productType}</h4>
              <p className="text-sm text-muted-foreground">Top {match.recommendations.length} SKU recommendations</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Spec Match
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      RFP Spec
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      SKU Spec
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Unit Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {match.recommendations.map((rec, recIndex) => (
                    <tr key={recIndex} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4 text-sm">
                        <Badge variant={recIndex === 0 ? "default" : "secondary"}>#{recIndex + 1}</Badge>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-foreground">{rec.sku}</td>
                      <td className="px-4 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          {rec.matchPercentage >= 90 ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : rec.matchPercentage >= 70 ? (
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="font-semibold text-foreground">{rec.matchPercentage}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{rec.rfpSpec}</td>
                      <td className="px-4 py-4 text-sm text-foreground">{rec.skuSpec}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-foreground">${rec.unitPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
