import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"
import type { Pricing } from "@/lib/mock-data"

interface PricingSectionProps {
  pricing: Pricing
}

export function PricingSection({ pricing }: PricingSectionProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Material Costs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-primary" />
            Material Costs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pricing.materials.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity.toLocaleString()} × ${item.unitPrice.toFixed(2)}
                </p>
              </div>
              <p className="text-sm font-semibold text-foreground">${item.total.toLocaleString()}</p>
            </div>
          ))}
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Materials Subtotal</p>
              <p className="text-base font-bold text-foreground">${pricing.materialsTotal.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Costs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-primary" />
            Testing Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pricing.tests.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity} tests × ${item.unitPrice.toFixed(2)}
                </p>
              </div>
              <p className="text-sm font-semibold text-foreground">${item.total.toLocaleString()}</p>
            </div>
          ))}
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Testing Subtotal</p>
              <p className="text-base font-bold text-foreground">${pricing.testsTotal.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Cost */}
      <Card className="md:col-span-2">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Project Cost</p>
              <p className="text-xs text-muted-foreground">Materials + Testing Services</p>
            </div>
            <p className="text-3xl font-bold text-primary">${pricing.totalCost.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
