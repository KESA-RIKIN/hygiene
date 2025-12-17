"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SettingsIcon, Bell, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SettingsPage() {
  const [priorityThreshold, setPriorityThreshold] = useState([7])
  const [maxConcurrent, setMaxConcurrent] = useState([3])
  const { toast } = useToast()

  const [notifications, setNotifications] = useState({
    newRfp: true,
    dueReminders: true,
    lowSpecMatch: true,
    proposalGenerated: true,
  })

  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your configuration has been updated successfully",
    })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Agent Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-blue-600" />
            Agent Configuration
          </CardTitle>
          <p className="text-sm text-slate-600">Control how Master Agent prioritizes and orchestrates RFPs</p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <Label>Priority Threshold (days until due)</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={priorityThreshold}
                onValueChange={setPriorityThreshold}
                max={14}
                min={1}
                step={1}
                className="flex-1"
              />
              <Badge className="w-16 justify-center">{priorityThreshold[0]} days</Badge>
            </div>
            <p className="text-xs text-slate-600">
              RFPs due within this many days will be automatically marked as High Priority
            </p>
          </div>

          <div className="space-y-4">
            <Label>Max Concurrent RFPs per Agent</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={maxConcurrent}
                onValueChange={setMaxConcurrent}
                max={10}
                min={1}
                step={1}
                className="flex-1"
              />
              <Badge className="w-16 justify-center">{maxConcurrent[0]} RFPs</Badge>
            </div>
            <p className="text-xs text-slate-600">
              Limits how many RFPs each agent (Sales/Technical/Pricing) can work on simultaneously
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Notification Preferences
          </CardTitle>
          <p className="text-sm text-slate-600">Choose which alerts you want to receive</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="new-rfp">New RFP Identified</Label>
              <p className="text-xs text-slate-600">Get notified when Sales Agent identifies a new tender</p>
            </div>
            <Switch
              id="new-rfp"
              checked={notifications.newRfp}
              onCheckedChange={(checked) => setNotifications({ ...notifications, newRfp: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="due-reminders">RFP Due Reminders</Label>
              <p className="text-xs text-slate-600">Alerts for upcoming submission deadlines</p>
            </div>
            <Switch
              id="due-reminders"
              checked={notifications.dueReminders}
              onCheckedChange={(checked) => setNotifications({ ...notifications, dueReminders: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="low-spec">Low Spec Match Alerts</Label>
              <p className="text-xs text-slate-600">When Technical Agent finds spec matches below 75%</p>
            </div>
            <Switch
              id="low-spec"
              checked={notifications.lowSpecMatch}
              onCheckedChange={(checked) => setNotifications({ ...notifications, lowSpecMatch: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="proposal">Proposal Generated Events</Label>
              <p className="text-xs text-slate-600">When Pricing Agent completes a proposal</p>
            </div>
            <Switch
              id="proposal"
              checked={notifications.proposalGenerated}
              onCheckedChange={(checked) => setNotifications({ ...notifications, proposalGenerated: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Data Sources (Mocked)
          </CardTitle>
          <p className="text-sm text-slate-600">Configured sources for RFP identification and product catalog</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-semibold">RFP Portals (URLs)</Label>
            <div className="mt-2 space-y-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="font-mono text-xs text-blue-600">https://tenders.gov.in/nicgep/app</p>
                <Badge className="mt-1 bg-green-100 text-green-700">Active</Badge>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="font-mono text-xs text-blue-600">https://eprocure.gov.in/eprocure/app</p>
                <Badge className="mt-1 bg-green-100 text-green-700">Active</Badge>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold">Email Inboxes</Label>
            <div className="mt-2 space-y-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="font-mono text-xs text-blue-600">rfp@asianpaints-cables.com</p>
                <Badge className="mt-1 bg-green-100 text-green-700">Connected</Badge>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold">Product Catalog Source</Label>
            <div className="mt-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm text-slate-900">Internal SKU Database</p>
                <p className="mt-1 text-xs text-slate-600">Last synced: 2 hours ago</p>
                <Badge className="mt-1 bg-green-100 text-green-700">Connected</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} size="lg">
          Save All Settings
        </Button>
      </div>
    </div>
  )
}
