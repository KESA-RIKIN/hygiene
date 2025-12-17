"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { productCatalog } from "@/lib/mock-data"

export function ProductCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSku, setSelectedSku] = useState<string | null>(null)

  const filteredProducts = productCatalog.filter(
    (product) =>
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.insulation.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedProduct = productCatalog.find((p) => p.sku === selectedSku)

  return (
    <div className="mx-auto max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle>OEM Product Catalog</CardTitle>
          <p className="text-sm text-slate-600">All SKUs available for RFP spec matching</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by SKU, product name, insulation type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Product Table */}
            <div className="lg:col-span-2">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-sm font-medium text-slate-600">
                      <th className="pb-3">SKU</th>
                      <th className="pb-3">Product Name</th>
                      <th className="pb-3">Voltage</th>
                      <th className="pb-3">Conductor</th>
                      <th className="pb-3">Area</th>
                      <th className="pb-3">Insulation</th>
                      <th className="pb-3 text-right">Price (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.sku}
                        onClick={() => setSelectedSku(product.sku)}
                        className={`cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50 ${
                          selectedSku === product.sku ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="py-3 font-mono text-sm text-blue-600">{product.sku}</td>
                        <td className="py-3 text-sm text-slate-900">{product.name}</td>
                        <td className="py-3 text-sm text-slate-700">{product.voltage}</td>
                        <td className="py-3">
                          <Badge variant="outline" className="text-xs">
                            {product.conductor}
                          </Badge>
                        </td>
                        <td className="py-3 text-sm text-slate-700">{product.area}</td>
                        <td className="py-3">
                          <Badge
                            className={
                              product.insulation === "XLPE"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }
                          >
                            {product.insulation}
                          </Badge>
                        </td>
                        <td className="py-3 text-right text-sm font-semibold text-slate-900">
                          {product.basePrice.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SKU Details Panel */}
            <div>
              {selectedProduct ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">SKU Details</CardTitle>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedSku(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-600">SKU</p>
                      <p className="font-mono text-sm font-semibold text-blue-600">{selectedProduct.sku}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Product Name</p>
                      <p className="text-sm font-medium text-slate-900">{selectedProduct.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-600">Voltage Grade</p>
                        <p className="text-sm text-slate-900">{selectedProduct.voltage}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Conductor</p>
                        <Badge variant="outline">{selectedProduct.conductor}</Badge>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Cross-Section</p>
                        <p className="text-sm text-slate-900">{selectedProduct.area}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Insulation</p>
                        <Badge
                          className={
                            selectedProduct.insulation === "XLPE"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }
                        >
                          {selectedProduct.insulation}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Armouring</p>
                        <p className="text-sm text-slate-900">{selectedProduct.armouring ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Base Price</p>
                        <p className="text-sm font-semibold text-slate-900">
                          ₹{selectedProduct.basePrice.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-blue-50 p-3">
                      <p className="text-xs font-semibold text-blue-900">Spec Match Examples</p>
                      <p className="mt-1 text-xs text-blue-700">Matches ITEM-1 in NTPC RFP at 96%</p>
                      <p className="text-xs text-blue-700">Matches ITEM-2 in Metro Rail RFP at 89%</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex h-64 items-center justify-center">
                    <p className="text-sm text-slate-500">Select a SKU to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
