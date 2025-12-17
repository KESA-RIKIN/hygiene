"use client"

import type React from "react"

import { useState } from "react"
import { FileText, CheckCircle2, Target, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface LoginPageProps {
  onLogin: (mode: "professional" | "company" | "demo") => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<"professional" | "company" | "demo">("professional")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent, mode: "professional" | "company" | "demo") => {
    e.preventDefault()
    setLoading(true)

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log(`[SmartRFP] ${mode} login initiated`)
    setLoading(false)
    onLogin(mode)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Login Forms */}
      <div className="flex w-full flex-col justify-center px-8 py-12 lg:w-[55%] lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Logo & Tagline */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">SmartRFP</h1>
                <p className="text-xs text-muted-foreground">Agentic AI Platform</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Agentic AI for B2B RFP Response Automation</p>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex gap-2 rounded-lg bg-muted p-1">
            <button
              onClick={() => setActiveTab("professional")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "professional"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Professional
            </button>
            <button
              onClick={() => setActiveTab("company")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "company"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Company
            </button>
            <button
              onClick={() => setActiveTab("demo")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "demo"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Demo
            </button>
          </div>

          {/* Professional Login Form */}
          {activeTab === "professional" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">Login for Professionals</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  For sales, technical and pricing teams responding to RFPs.
                </p>
              </div>
              <form onSubmit={(e) => handleSubmit(e, "professional")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" placeholder="you@company.com" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" required className="h-11" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm font-normal">
                      Remember me
                    </Label>
                  </div>
                  <button type="button" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>
                <Button type="submit" className="h-11 w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Login as Professional"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Access your RFP workspace, spec matching, and pricing pipeline.
                </p>
              </form>
            </div>
          )}

          {/* Company Login Form */}
          {activeTab === "company" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">Company Login</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  For OEM / enterprise admins configuring SmartRFP for their organization.
                </p>
              </div>
              <form onSubmit={(e) => handleSubmit(e, "company")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-id">Company ID or Domain</Label>
                  <Input id="company-id" type="text" placeholder="acme-corp" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input id="admin-email" type="email" placeholder="admin@company.com" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    required
                    className="h-11"
                  />
                </div>
                <Button type="submit" className="h-11 w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Login as Company Admin"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Configure data sources, product catalogs, and notification policies.
                </p>
              </form>
            </div>
          )}

          {/* Demo Login */}
          {activeTab === "demo" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">Demo Login (Judges / Guests)</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Explore SmartRFP with sample RFPs, catalogs and analytics preloaded.
                </p>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-chart-3" />
                    Demo includes:
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-chart-1">•</span>
                      <span>5 sample RFPs with complete spec requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-chart-1">•</span>
                      <span>50+ OEM SKUs in product catalog</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-chart-1">•</span>
                      <span>Performance analytics and insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-chart-1">•</span>
                      <span>Full agent workflow demonstrations</span>
                    </li>
                  </ul>
                </div>
                <Button onClick={(e) => handleSubmit(e as any, "demo")} className="h-11 w-full" disabled={loading}>
                  {loading ? "Loading demo..." : "Enter Demo Mode"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  No setup required. Instant access to full platform capabilities.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Hero / Value Proposition */}
      <div className="hidden bg-gradient-to-br from-primary/10 via-chart-3/10 to-chart-4/10 lg:flex lg:w-[45%] lg:flex-col lg:justify-center lg:px-12">
        <div className="mx-auto max-w-lg">
          {/* Hero Content */}
          <div className="mb-8">
            <h2 className="mb-6 text-4xl font-bold leading-tight text-foreground">
              Cut RFP response time from days to minutes.
            </h2>

            {/* Key Benefits */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-chart-1 text-primary-foreground">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Agentic AI Master Agent</h3>
                  <p className="text-sm text-muted-foreground">
                    Orchestrating Sales, Technical, and Pricing workflows automatically.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-chart-2 text-accent-foreground">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Auto-match RFP specs to OEM SKUs</h3>
                  <p className="text-sm text-muted-foreground">
                    Intelligent matching with Spec Match % metric for confidence scoring.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-chart-3 text-chart-3">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Consolidated pricing</h3>
                  <p className="text-sm text-muted-foreground">
                    Including materials and test costs with transparent breakdowns.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm">
            <div>
              <div className="text-3xl font-bold text-chart-1">3×</div>
              <div className="text-sm text-muted-foreground">more RFPs handled per month</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-chart-3">90%</div>
              <div className="text-sm text-muted-foreground">on-time submissions</div>
            </div>
          </div>

          {/* Process Flow */}
          <div className="mt-8 flex items-center justify-between rounded-xl border border-border bg-card/50 p-4 backdrop-blur-sm">
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-chart-1/20 text-chart-1">
                <span className="text-lg font-bold">1</span>
              </div>
              <div className="text-xs font-medium text-foreground">Upload RFP</div>
            </div>
            <div className="h-px flex-1 bg-border" />
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-chart-2/20 text-chart-2">
                <span className="text-lg font-bold">2</span>
              </div>
              <div className="text-xs font-medium text-foreground">Match Specs</div>
            </div>
            <div className="h-px flex-1 bg-border" />
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-chart-3/20 text-chart-3">
                <span className="text-lg font-bold">3</span>
              </div>
              <div className="text-xs font-medium text-foreground">Price & Propose</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
