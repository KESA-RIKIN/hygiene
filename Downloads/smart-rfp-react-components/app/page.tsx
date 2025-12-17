"use client"

import { useState } from "react"
import { Bell, FileText, LayoutDashboard, Package, BarChart3, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DashboardPage } from "@/components/dashboard-page"
import { RfpWorkspacePage } from "@/components/rfp-workspace-page"
import { ProductCatalogPage } from "@/components/product-catalog-page"
import { AnalyticsPage } from "@/components/analytics-page"
import { SettingsPage } from "@/components/settings-page"
import { LoginPage } from "@/components/login-page"
import { notifications as initialNotifications, type Notification } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginMode, setLoginMode] = useState<"professional" | "company" | "demo" | null>(null)
  const { toast } = useToast()

  const [activePage, setActivePage] = useState<"dashboard" | "workspace" | "catalog" | "analytics" | "settings">(
    "dashboard",
  )
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotif: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    }
    setNotifications([newNotif, ...notifications])
  }

  const handleLogin = (mode: "professional" | "company" | "demo") => {
    setLoginMode(mode)
    setIsAuthenticated(true)

    const messages = {
      professional: "Logged in as Professional. Access to RFP workspace enabled.",
      company: "Logged in as Company Admin. Full system configuration available.",
      demo: "Demo workspace loaded with sample RFPs, catalogs, and analytics.",
    }

    toast({
      title: "Login Successful",
      description: messages[mode],
    })
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="flex min-h-screen bg-muted">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-border p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">SmartRFP</h1>
                <p className="text-xs text-muted-foreground">Multi-Agent AI Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <button
              onClick={() => setActivePage("dashboard")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activePage === "dashboard" ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </button>
            <button
              onClick={() => setActivePage("workspace")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activePage === "workspace" ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              <FileText className="h-5 w-5" />
              RFP Workspace
            </button>
            <button
              onClick={() => setActivePage("catalog")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activePage === "catalog" ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              <Package className="h-5 w-5" />
              Product Catalog
            </button>
            <button
              onClick={() => setActivePage("analytics")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activePage === "analytics" ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              Analytics
            </button>
            <button
              onClick={() => setActivePage("settings")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activePage === "settings" ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              <Settings className="h-5 w-5" />
              Settings
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <header className="border-b border-border bg-card">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {activePage === "dashboard" && "Dashboard"}
                {activePage === "workspace" && "RFP Workspace"}
                {activePage === "catalog" && "Product Catalog"}
                {activePage === "analytics" && "Analytics"}
                {activePage === "settings" && "Settings"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {activePage === "dashboard" && "High-level view of RFP health and bottlenecks"}
                {activePage === "workspace" && "End-to-end RFP processing with AI agents"}
                {activePage === "catalog" && "OEM SKU database for spec matching"}
                {activePage === "analytics" && "Performance metrics and bottleneck analysis"}
                {activePage === "settings" && "Agent configuration and preferences"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="relative rounded-lg p-2 hover:bg-muted">
                    <Bell className="h-5 w-5 text-foreground" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-destructive p-0 text-xs text-destructive-foreground">
                        {unreadCount}
                      </Badge>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="end">
                  <div className="border-b border-border p-4">
                    <h3 className="font-semibold text-foreground">Notifications</h3>
                    <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-sm text-muted-foreground">No notifications</div>
                    ) : (
                      notifications.map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`w-full border-b border-border p-4 text-left transition-colors hover:bg-muted ${
                            !notif.read ? "bg-accent/50" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p
                                className={`text-sm ${!notif.read ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                              >
                                {notif.title}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">{notif.message}</p>
                              <p className="mt-1 text-xs text-muted-foreground/70">
                                {new Date(notif.timestamp).toLocaleString()}
                              </p>
                            </div>
                            {!notif.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {loginMode === "demo" ? "Demo Mode" : loginMode === "company" ? "Admin" : "Professional"}
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                {loginMode === "demo" ? "DM" : loginMode === "company" ? "AD" : "PR"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-12">
          {activePage === "dashboard" && <DashboardPage />}
          {activePage === "workspace" && <RfpWorkspacePage addNotification={addNotification} />}
          {activePage === "catalog" && <ProductCatalogPage />}
          {activePage === "analytics" && <AnalyticsPage />}
          {activePage === "settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  )
}
