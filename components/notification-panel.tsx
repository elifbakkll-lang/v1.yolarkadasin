"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  X,
  Clock,
  MapPin,
  ChevronRight,
  Settings,
  BellOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export interface Notification {
  id: string
  type: "warning" | "success" | "info"
  title: string
  message: string
  location?: string
  timestamp: Date
  read: boolean
}

interface NotificationPanelProps {
  notifications: Notification[]
  onNotificationRead: (id: string) => void
  onNotificationDismiss: (id: string) => void
  onClearAll: () => void
  className?: string
}

const typeConfig = {
  warning: {
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  success: {
    icon: CheckCircle2,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  info: {
    icon: Info,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    borderColor: "border-chart-2/20",
  },
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Az önce"
  if (diffMins < 60) return `${diffMins} dk önce`
  if (diffHours < 24) return `${diffHours} saat önce`
  return `${diffDays} gün önce`
}

export function NotificationPanel({ 
  notifications, 
  onNotificationRead,
  onNotificationDismiss,
  onClearAll,
  className 
}: NotificationPanelProps) {
  const [activeTab, setActiveTab] = useState("all")

  const unreadCount = notifications.filter(n => !n.read).length
  const warningNotifications = notifications.filter(n => n.type === "warning")
  const otherNotifications = notifications.filter(n => n.type !== "warning")

  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : activeTab === "warnings" 
      ? warningNotifications 
      : otherNotifications

  return (
    <aside 
      className={cn(
        "flex h-full w-80 flex-col border-l border-border bg-card",
        className
      )}
      aria-label="Bildirimler"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-card-foreground">Bildirimler</h2>
          {unreadCount > 0 && (
            <Badge variant="default" className="h-5 min-w-5 rounded-full px-1.5 text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Bildirim ayarları"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 grid w-auto grid-cols-3 bg-muted">
          <TabsTrigger value="all" className="text-xs">
            Tümü
            {notifications.length > 0 && (
              <span className="ml-1 text-muted-foreground">({notifications.length})</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="warnings" className="text-xs">
            Uyarılar
            {warningNotifications.length > 0 && (
              <span className="ml-1 text-muted-foreground">({warningNotifications.length})</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="other" className="text-xs">
            Diğer
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="flex-1 mt-0 data-[state=active]:flex data-[state=active]:flex-col">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <BellOff className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-foreground">Bildirim yok</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Yeni bildirimler burada görünecek
              </p>
            </div>
          ) : (
            <ScrollArea className="flex-1">
              <div className="space-y-2 p-4">
                {filteredNotifications.map((notification) => {
                  const config = typeConfig[notification.type]
                  const Icon = config.icon

                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        "group relative rounded-lg border p-3 transition-all cursor-pointer",
                        config.borderColor,
                        config.bgColor,
                        !notification.read && "ring-1 ring-primary/20",
                        "hover:shadow-sm"
                      )}
                      onClick={() => onNotificationRead(notification.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          onNotificationRead(notification.id)
                        }
                      }}
                    >
                      {/* Dismiss button */}
                      <button
                        className="absolute right-2 top-2 rounded-full p-1 opacity-0 transition-opacity hover:bg-background/50 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          onNotificationDismiss(notification.id)
                        }}
                        aria-label="Bildirimi kaldır"
                      >
                        <X className="h-3 w-3 text-muted-foreground" />
                      </button>

                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="absolute left-1 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
                      )}

                      <div className="flex gap-3 pl-2">
                        <div className={cn("mt-0.5 rounded-full p-1.5", config.bgColor)}>
                          <Icon className={cn("h-4 w-4", config.color)} aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground pr-6">
                            {notification.title}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" aria-hidden="true" />
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            {notification.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" aria-hidden="true" />
                                {notification.location}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground self-center opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-border p-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onClearAll}
          >
            Tümünü Temizle
          </Button>
        </div>
      )}
    </aside>
  )
}
