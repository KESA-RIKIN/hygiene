import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Requirement } from "@/lib/mock-data"

interface RequirementsTableProps {
  requirements: Requirement[]
}

export function RequirementsTable({ requirements }: RequirementsTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Product Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Specifications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Required Tests
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {requirements.map((req, index) => (
                <tr key={index} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{req.productType}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{req.quantity.toLocaleString()} units</td>
                  <td className="px-6 py-4 text-sm text-foreground">{req.specifications}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {req.requiredTests.map((test, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {test}
                        </Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
