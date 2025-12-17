"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Play, RefreshCw, FileText, IndianRupee, Upload, FileUp } from "lucide-react"
import { rfpList, type Rfp, skuRecommendations, pricingData } from "@/lib/mock-data"

type Notification = {
  title: string
  message: string
  type: "info" | "success" | "warning"
}

export function RfpWorkspacePage({ addNotification }: { addNotification: (notif: Notification) => void }) {
  const [rfps, setRfps] = useState<Rfp[]>(rfpList)
  const [selectedRfp, setSelectedRfp] = useState("RFP-2025-001")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [showProposal, setShowProposal] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [lastUploadedRfp, setLastUploadedRfp] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFileUpload = useCallback(
    (file: File | null) => {
      if (!file) return

      setIsUploading(true)
      toast({ title: "Uploading RFP", description: `Processing ${file.name}...` })

      // Simulate upload and processing
      setTimeout(() => {
        const newRfpId = `RFP-2025-${String(rfps.length + 1).padStart(3, "0")}`
        const newRfp: Rfp = {
          id: newRfpId,
          client: "NTPC Power Limited",
          source: "Upload",
          dueDate: "Feb 15, 2025",
          status: "Not Actioned",
          priority: "Medium",
          daysRemaining: "28 days",
          items: [
            {
              id: "ITEM-1",
              description: "11kV 3 Core Aluminium Armoured Cable 95 sq.mm XLPE",
              quantity: "5000 m",
              tests: ["High Voltage", "Partial Discharge"],
            },
          ],
        }

        setRfps([newRfp, ...rfps])
        setLastUploadedRfp(newRfpId)
        setIsUploading(false)

        addNotification({
          title: "RFP Uploaded Successfully",
          message: `${newRfpId} from NTPC Power Limited added to queue`,
          type: "success",
        })

        toast({
          title: "Upload Complete",
          description: "Sales Agent will qualify and prioritize this RFP",
        })
      }, 2000)
    },
    [rfps, addNotification, toast],
  )

  const runMasterAgent = () => {
    setIsProcessing(true)
    toast({ title: "Master Agent Running", description: "Checking due dates and assigning priorities..." })

    setTimeout(() => {
      setRfps(
        rfps.map((rfp) => {
          const daysRemaining = Number.parseInt(rfp.daysRemaining)
          if (daysRemaining <= 3 && daysRemaining >= 0) {
            return { ...rfp, priority: "High", status: "In Progress" }
          }
          return rfp
        }),
      )
      setIsProcessing(false)
      addNotification({
        title: "Master Agent Complete",
        message: "Updated priorities for 3 RFPs with due dates < 3 days",
        type: "success",
      })
      toast({ title: "Complete", description: "RFP priorities updated successfully" })
    }, 2500)
  }

  const regenerateMatches = () => {
    setIsRegenerating(true)
    toast({ title: "Technical Agent Running", description: "Regenerating SKU recommendations..." })

    setTimeout(() => {
      setIsRegenerating(false)
      addNotification({
        title: "Technical Agent Updated",
        message: `SKU recommendations regenerated for ${selectedRfp}`,
        type: "info",
      })
      toast({ title: "Complete", description: "SKU matches updated successfully" })
    }, 2000)
  }

  const generateProposal = () => {
    setShowProposal(true)
    addNotification({
      title: "Pricing Agent Generated Proposal",
      message: `Draft proposal ready for ${selectedRfp}`,
      type: "success",
    })
  }

  const selectedRfpData = rfps.find((r) => r.id === selectedRfp)

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <Card className="border-2 border-dashed border-primary/30 bg-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <FileUp className="h-5 w-5" />
            </div>
            Upload New RFP
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Drop a PDF/DOCX RFP here. SmartRFP will extract line items and start the agentic workflow.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="relative flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-8 transition-colors hover:border-primary hover:bg-accent/50"
            onClick={() => {
              const input = document.createElement("input")
              input.type = "file"
              input.accept = ".pdf,.docx,.doc"
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0]
                if (file) handleFileUpload(file)
              }
              input.click()
            }}
            onDrop={(e) => {
              e.preventDefault()
              const file = e.dataTransfer.files[0]
              if (file) handleFileUpload(file)
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                <p className="text-sm font-medium text-foreground">Processing RFP...</p>
              </div>
            ) : (
              <>
                <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-center text-sm font-medium text-foreground">Drop RFP file or click to browse</p>
                <p className="mt-1 text-center text-xs text-muted-foreground">Supports PDF, DOCX</p>
                <p className="mt-2 text-center text-xs text-muted-foreground/70">Example: Power cable RFP from NTPC</p>
              </>
            )}
          </div>

          {lastUploadedRfp && (
            <div className="rounded-lg bg-primary/5 p-3">
              <p className="text-xs font-medium text-muted-foreground">Last uploaded RFP</p>
              <div className="mt-1 flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm font-semibold text-primary">{lastUploadedRfp}</p>
                  <p className="text-xs text-muted-foreground">
                    {rfps.find((r) => r.id === lastUploadedRfp)?.client} • Due:{" "}
                    {rfps.find((r) => r.id === lastUploadedRfp)?.dueDate}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Ready for review
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 1: Sales Agent - RFP Identification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="rounded-lg bg-chart-2/10 p-2 text-chart-2">
              <FileText className="h-5 w-5" />
            </div>
            RFP Identification & Qualification
          </CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Sales Agent:</span> Scans email, GeM portal, and client
            sites to centralize incoming tenders. Manual RFP identification causes missed deadlines – SmartRFP's agentic
            AI prioritizes and qualifies RFPs automatically in one place.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={runMasterAgent} disabled={isProcessing}>
              <Play className="mr-2 h-4 w-4" />
              {isProcessing ? "Processing..." : "Run Master Agent for Due RFPs"}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm font-medium text-muted-foreground">
                  <th className="pb-3">RFP ID</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Source</th>
                  <th className="pb-3">Due Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Priority</th>
                  <th className="pb-3">Days Remaining</th>
                </tr>
              </thead>
              <tbody>
                {rfps.map((rfp) => (
                  <tr key={rfp.id} className="border-b border-border/50">
                    <td className="py-4 font-mono text-sm text-primary">{rfp.id}</td>
                    <td className="py-4 text-sm font-medium text-foreground">{rfp.client}</td>
                    <td className="py-4 text-sm text-muted-foreground">{rfp.source}</td>
                    <td className="py-4 text-sm text-muted-foreground">{rfp.dueDate}</td>
                    <td className="py-4">
                      <Badge
                        className={
                          rfp.status === "Submitted"
                            ? "bg-chart-3/10 text-chart-3"
                            : rfp.status === "In Progress"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {rfp.status}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <Badge
                        className={
                          rfp.priority === "High"
                            ? "bg-destructive/10 text-destructive"
                            : rfp.priority === "Medium"
                              ? "bg-destructive/20 text-destructive/70"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {rfp.priority}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <span
                        className={`text-sm font-medium ${
                          rfp.daysRemaining.includes("Overdue")
                            ? "text-destructive"
                            : Number.parseInt(rfp.daysRemaining) <= 3
                              ? "text-destructive/70"
                              : "text-muted-foreground"
                        }`}
                      >
                        {rfp.daysRemaining}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Technical Agent - Spec Matching */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="rounded-lg bg-chart-3/10 p-2 text-chart-3">
              <RefreshCw className="h-5 w-5" />
            </div>
            Technical Spec Matching
          </CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Technical Agent:</span> Maps each RFP line item to the
            closest OEM SKUs from your catalog and computes a Spec Match % metric. Manual spec comparison is error-prone
            and time-consuming – our agentic AI evaluates hundreds of parameters instantly.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Select value={selectedRfp} onValueChange={setSelectedRfp}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rfps.map((rfp) => (
                  <SelectItem key={rfp.id} value={rfp.id}>
                    {rfp.id} - {rfp.client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={regenerateMatches} disabled={isRegenerating} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              {isRegenerating ? "Regenerating..." : "Regenerate Matches"}
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* RFP Line Items */}
            <div>
              <h3 className="mb-4 font-semibold text-foreground">RFP Line Items</h3>
              <div className="space-y-4">
                {selectedRfpData?.items.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border bg-accent/30 p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <span className="font-mono text-xs text-primary">{item.id}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.quantity}
                      </Badge>
                    </div>
                    <p className="mb-2 text-sm font-medium text-foreground">{item.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.tests.map((test) => (
                        <Badge key={test} variant="secondary" className="text-xs">
                          {test}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SKU Recommendations */}
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Top 3 SKU Recommendations</h3>
              <div className="space-y-4">
                {skuRecommendations.map((rec) => (
                  <div key={rec.sku} className="rounded-lg border border-border bg-card p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="font-mono text-sm font-semibold text-foreground">{rec.sku}</p>
                        <p className="text-xs text-muted-foreground">for {rec.rfpItem}</p>
                      </div>
                      <Badge
                        className={
                          rec.specMatch >= 90
                            ? "bg-chart-3/10 text-chart-3"
                            : rec.specMatch >= 75
                              ? "bg-destructive/20 text-destructive/70"
                              : "bg-destructive/10 text-destructive"
                        }
                      >
                        {rec.specMatch}% match
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{rec.keyDifferences}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Pricing Agent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="rounded-lg bg-chart-4/10 p-2 text-chart-4">
              <IndianRupee className="h-5 w-5" />
            </div>
            Pricing & Proposal Assembly
          </CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Pricing Agent:</span> Consolidates material prices, test
            costs, and margins into a ready-to-send proposal. Manual pricing assembly takes hours and risks errors –
            SmartRFP's agentic AI generates accurate proposals in seconds.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm font-medium text-muted-foreground">
                  <th className="pb-3">SKU</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3 text-right">Quantity</th>
                  <th className="pb-3 text-right">Unit Price (₹)</th>
                  <th className="pb-3 text-right">Test Cost (₹)</th>
                  <th className="pb-3 text-right">Line Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {pricingData.map((row) => (
                  <tr key={row.sku} className="border-b border-border/50">
                    <td className="py-3 font-mono text-sm text-primary">{row.sku}</td>
                    <td className="py-3 text-sm text-foreground">{row.description}</td>
                    <td className="py-3 text-right text-sm text-muted-foreground">{row.quantity}</td>
                    <td className="py-3 text-right text-sm text-muted-foreground">{row.unitPrice.toLocaleString()}</td>
                    <td className="py-3 text-right text-sm text-muted-foreground">{row.testCost.toLocaleString()}</td>
                    <td className="py-3 text-right font-semibold text-foreground">{row.lineTotal.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border">
                  <td colSpan={5} className="py-3 text-right font-semibold text-foreground">
                    Material Total:
                  </td>
                  <td className="py-3 text-right font-semibold text-foreground">
                    ₹{pricingData.reduce((sum, row) => sum + row.unitPrice * row.quantity, 0).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} className="py-3 text-right font-semibold text-foreground">
                    Testing Total:
                  </td>
                  <td className="py-3 text-right font-semibold text-foreground">
                    ₹{pricingData.reduce((sum, row) => sum + row.testCost, 0).toLocaleString()}
                  </td>
                </tr>
                <tr className="border-t-2 border-border">
                  <td colSpan={5} className="py-3 text-right text-lg font-bold text-foreground">
                    Grand Total:
                  </td>
                  <td className="py-3 text-right text-lg font-bold text-primary">
                    ₹{pricingData.reduce((sum, row) => sum + row.lineTotal, 0).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex justify-end">
            <Button onClick={generateProposal} size="lg">
              <FileText className="mr-2 h-4 w-4" />
              Generate Proposal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Proposal Dialog */}
      <Dialog open={showProposal} onOpenChange={setShowProposal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Proposal Generated</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">RFP ID</p>
                <p className="font-semibold text-foreground">{selectedRfp}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-semibold text-foreground">{selectedRfpData?.client}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Grand Total</p>
                <p className="text-2xl font-bold text-primary">
                  ₹{pricingData.reduce((sum, row) => sum + row.lineTotal, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Saved</p>
                <Badge className="bg-chart-3/10 text-chart-3">3 days → 5 minutes</Badge>
              </div>
            </div>

            <div className="rounded-lg bg-primary/5 p-4">
              <p className="text-sm font-semibold text-foreground">Ready to submit</p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li>• All RFP line items mapped to OEM SKUs</li>
                <li>• Testing costs included as per RFP requirements</li>
                <li>• Ready to export to PDF or submit via portal</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                Download PDF (Simulated)
              </Button>
              <Button variant="outline" onClick={() => setShowProposal(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
