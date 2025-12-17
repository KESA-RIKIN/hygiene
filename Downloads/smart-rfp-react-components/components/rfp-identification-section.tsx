"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type RfpStatus = "Not Actioned" | "Actioned Late" | "In Progress" | "Submitted"
type RfpPriority = "High" | "Medium" | "Low"

interface RfpRecord {
  id: string
  client: string
  source: string
  dueDate: string
  status: RfpStatus
  priority: RfpPriority
}

const initialRfps: RfpRecord[] = [
  {
    id: "RFP-2025-001",
    client: "NTPC Power Limited",
    source: "Email",
    dueDate: "15 Jan 2025",
    status: "Not Actioned",
    priority: "High",
  },
  {
    id: "RFP-2025-002",
    client: "State Transmission Corp",
    source: "Website",
    dueDate: "10 Jan 2025",
    status: "Actioned Late",
    priority: "Medium",
  },
  {
    id: "RFP-2025-003",
    client: "Metro Rail Project",
    source: "Email",
    dueDate: "22 Jan 2025",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "RFP-2025-004",
    client: "Industrial Park Authority",
    source: "Website",
    dueDate: "28 Jan 2025",
    status: "Not Actioned",
    priority: "Low",
  },
]

export function RfpIdentificationSection() {
  const [rfps, setRfps] = useState<RfpRecord[]>(initialRfps)
  const [isRunningAgent, setIsRunningAgent] = useState(false)
  const { toast } = useToast()

  const handleRunMasterAgent = () => {
    setIsRunningAgent(true)

    setTimeout(() => {
      // Update high-priority RFPs to "In Progress"
      setRfps((prev) =>
        prev.map((rfp) =>
          rfp.priority === "High" && rfp.status === "Not Actioned" ? { ...rfp, status: "In Progress" } : rfp,
        ),
      )
      setIsRunningAgent(false)
      toast({
        title: "Master Agent Complete",
        description: "Master Agent scanned upcoming due dates and auto-prioritized 3 RFPs.",
      })
    }, 2500)
  }

  const getPriorityColor = (priority: RfpPriority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-700 border-green-200"
    }
  }

  const getStatusColor = (status: RfpStatus) => {
    switch (status) {
      case "Not Actioned":
        return "bg-slate-100 text-slate-700 border-slate-200"
      case "Actioned Late":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "Submitted":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              RFP Identification & Prioritization (Sales Agent)
            </CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              Sales teams miss tenders because RFPs are seen late or not qualified on time. SmartRFP centralizes and
              prioritizes them.
            </p>
          </div>
          <Button onClick={handleRunMasterAgent} disabled={isRunningAgent} className="bg-blue-600 hover:bg-blue-700">
            {isRunningAgent ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              "Run Master Agent for Due RFPs"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isRunningAgent && (
          <div className="mb-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
            <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
            Master Agent orchestrating Sales, Technical, and Pricing agents...
          </div>
        )}
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                  RFP ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {rfps.map((rfp, index) => (
                <tr key={rfp.id} className={index % 2 === 1 ? "bg-slate-50" : ""}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{rfp.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{rfp.client}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">{rfp.source}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">{rfp.dueDate}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Badge variant="outline" className={getStatusColor(rfp.status)}>
                      {rfp.status}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Badge variant="outline" className={getPriorityColor(rfp.priority)}>
                      {rfp.priority}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Button variant="ghost" size="sm" className="gap-1">
                      Open in Workspace
                      <ChevronRight className="h-3 w-3" />
                    </Button>
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
