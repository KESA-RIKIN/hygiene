"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw } from "lucide-react"

interface RfpLineItem {
  id: string
  description: string
  quantity: string
  testsRequired: string[]
}

interface SkuRecommendation {
  rfpItem: string
  sku: string
  matchPercent: number
  keyDifferences: string
}

const lineItems: RfpLineItem[] = [
  {
    id: "ITEM-1",
    description: "4 Core LT Power Cable 50 sq.mm Aluminium 1.1kV XLPE",
    quantity: "2000 m",
    testsRequired: ["High Voltage", "Insulation Resistance", "Voltage Drop"],
  },
  {
    id: "ITEM-2",
    description: "3.5 Core LT Power Cable 120 sq.mm Aluminium 1.1kV XLPE",
    quantity: "1200 m",
    testsRequired: ["High Voltage", "Insulation Resistance"],
  },
  {
    id: "ITEM-3",
    description: "12 Core Control Cable 2.5 sq.mm Copper 1.1kV PVC",
    quantity: "1000 m",
    testsRequired: ["Conductor Resistance"],
  },
]

const skuRecommendations: SkuRecommendation[] = [
  {
    rfpItem: "ITEM-1",
    sku: "AP-CAB-4C-50XLPE",
    matchPercent: 96,
    keyDifferences: "Exact match on cores, area, voltage, XLPE insulation",
  },
  {
    rfpItem: "ITEM-1",
    sku: "AP-CAB-4C-50PVC",
    matchPercent: 82,
    keyDifferences: "Insulation differs (PVC vs XLPE)",
  },
  {
    rfpItem: "ITEM-1",
    sku: "GEN-CAB-4C-35XLPE",
    matchPercent: 70,
    keyDifferences: "Smaller cross-sectional area",
  },
  {
    rfpItem: "ITEM-2",
    sku: "AP-CAB-3P5C-120XLPE",
    matchPercent: 98,
    keyDifferences: "Perfect match for 3.5 core 120 sq.mm XLPE",
  },
  {
    rfpItem: "ITEM-2",
    sku: "AP-CAB-4C-120XLPE",
    matchPercent: 88,
    keyDifferences: "4 core instead of 3.5 core",
  },
  {
    rfpItem: "ITEM-2",
    sku: "AP-CAB-3P5C-95XLPE",
    matchPercent: 75,
    keyDifferences: "Smaller cross-sectional area (95 vs 120)",
  },
  {
    rfpItem: "ITEM-3",
    sku: "CTRL-12C-2.5PVC",
    matchPercent: 100,
    keyDifferences: "Exact match for 12 core 2.5 sq.mm copper PVC",
  },
  {
    rfpItem: "ITEM-3",
    sku: "CTRL-12C-2.5XLPE",
    matchPercent: 92,
    keyDifferences: "XLPE insulation instead of PVC",
  },
  {
    rfpItem: "ITEM-3",
    sku: "CTRL-10C-2.5PVC",
    matchPercent: 78,
    keyDifferences: "10 cores instead of 12",
  },
]

export function TechnicalSpecSection() {
  const [selectedRfp, setSelectedRfp] = useState("RFP-2025-001")
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string | null>("ITEM-1")

  const handleRegenerate = () => {
    setIsRegenerating(true)
    setTimeout(() => {
      setIsRegenerating(false)
    }, 1500)
  }

  const getMatchColor = (percent: number) => {
    if (percent >= 95) return "bg-emerald-100 text-emerald-700 border-emerald-200"
    if (percent >= 85) return "bg-blue-100 text-blue-700 border-blue-200"
    if (percent >= 75) return "bg-yellow-100 text-yellow-700 border-yellow-200"
    return "bg-orange-100 text-orange-700 border-orange-200"
  }

  const filteredRecommendations = selectedItem ? skuRecommendations.filter((rec) => rec.rfpItem === selectedItem) : []

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="text-2xl font-bold text-slate-900">Technical Spec Matching (Technical Agent)</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Today this is done manually in Excel with product catalogs. SmartRFP auto-ranks OEM SKUs against each RFP
            line item.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">Active RFP:</span>
            <div className="flex gap-2">
              {["RFP-2025-001", "RFP-2025-003"].map((rfpId) => (
                <button
                  key={rfpId}
                  onClick={() => setSelectedRfp(rfpId)}
                  className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                    selectedRfp === rfpId ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {rfpId}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: RFP Line Items */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-slate-900">RFP Line Items</h3>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                      Item ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {lineItems.map((item, index) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedItem(item.id)}
                      className={`cursor-pointer transition-colors ${
                        selectedItem === item.id ? "bg-blue-50" : index % 2 === 1 ? "bg-slate-50" : ""
                      } hover:bg-blue-50`}
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">{item.id}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        <div className="line-clamp-2">{item.description}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.testsRequired.map((test) => (
                            <Badge key={test} variant="outline" className="text-xs">
                              {test}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: SKU Recommendations */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Top 3 OEM SKU Recommendations</h3>
                <Badge className="mt-1 bg-purple-100 text-purple-700">Generated by Technical Agent</Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="gap-2 bg-transparent"
              >
                {isRegenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Regenerate
                  </>
                )}
              </Button>
            </div>
            {selectedItem ? (
              <div className="space-y-3">
                {filteredRecommendations.map((rec, index) => (
                  <div
                    key={`${rec.sku}-${index}`}
                    className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">{rec.sku}</span>
                          <Badge variant="outline" className={getMatchColor(rec.matchPercent)}>
                            {rec.matchPercent}% Match
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{rec.keyDifferences}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
                <p className="text-sm text-slate-500">Select an item from the left to view recommendations</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
