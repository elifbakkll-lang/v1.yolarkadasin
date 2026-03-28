"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Header } from "./header"
import { FilterSidebar, type FilterState } from "./filter-sidebar"
import { MapView } from "./map-view"
import { NotificationPanel, type Notification } from "./notification-panel"
import { Button } from "@/components/ui/button"
import { 
  PanelLeftClose, 
  PanelRightClose,
  PanelLeft,
  PanelRight 
} from "lucide-react"

// Sample notifications
const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "warning",
    title: "Asansör Arızası",
    message: "Taksim Metro İstasyonu asansörü geçici olarak hizmet dışıdır. Alternatif rota önerilir.",
    location: "Taksim, İstanbul",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    read: false,
  },
  {
    id: "2",
    type: "success",
    title: "Yeni Rampa Eklendi",
    message: "Kadıköy Sahil yoluna yeni engelli rampası eklendi ve doğrulandı.",
    location: "Kadıköy, İstanbul",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "İyilik Puanı Kazandınız",
    message: "Mekan fotoğrafı paylaşımınız için 50 iyilik puanı kazandınız!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: true,
  },
  {
    id: "4",
    type: "warning",
    title: "Kaldırım Engeli",
    message: "Beşiktaş Meydanı çevresinde geçici inşaat çalışması nedeniyle kaldırım daralmıştır.",
    location: "Beşiktaş, İstanbul",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true,
  },
  {
    id: "5",
    type: "success",
    title: "Rota Onaylandı",
    message: "Paylaştığınız erişilebilir rota topluluk tarafından doğrulandı.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
]

export function HomePage() {
  const [filters, setFilters] = useState<FilterState>({
    disabilityTypes: [],
    poiTypes: [],
    routePreferences: [],
  })

  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)

  const handleNotificationRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }, [])

  const handleNotificationDismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const handleClearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const handleLocationSelect = useCallback((location: { lat: number; lng: number; name: string }) => {
    console.log("[v0] Location selected:", location)
  }, [])

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <Header 
        showMenuButton={true}
        onMenuToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Filters */}
        <div 
          className={cn(
            "hidden md:flex transition-all duration-300 ease-in-out",
            leftSidebarOpen ? "w-80" : "w-0"
          )}
        >
          {leftSidebarOpen && (
            <FilterSidebar 
              filters={filters} 
              onFiltersChange={setFilters}
            />
          )}
        </div>

        {/* Toggle button for left sidebar */}
        <div className="hidden md:flex items-start pt-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-r-lg rounded-l-none border border-l-0 border-border bg-card hover:bg-accent"
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            aria-label={leftSidebarOpen ? "Filtreleri gizle" : "Filtreleri göster"}
          >
            {leftSidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Map */}
        <MapView 
          filters={filters}
          onLocationSelect={handleLocationSelect}
          className="flex-1"
        />

        {/* Toggle button for right panel */}
        <div className="hidden md:flex items-start pt-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-l-lg rounded-r-none border border-r-0 border-border bg-card hover:bg-accent"
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            aria-label={rightPanelOpen ? "Bildirimleri gizle" : "Bildirimleri göster"}
          >
            {rightPanelOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Right Panel - Notifications */}
        <div 
          className={cn(
            "hidden lg:flex transition-all duration-300 ease-in-out",
            rightPanelOpen ? "w-80" : "w-0"
          )}
        >
          {rightPanelOpen && (
            <NotificationPanel
              notifications={notifications}
              onNotificationRead={handleNotificationRead}
              onNotificationDismiss={handleNotificationDismiss}
              onClearAll={handleClearAllNotifications}
            />
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav 
        className="flex md:hidden items-center justify-around border-t border-border bg-card py-2 px-4"
        role="navigation"
        aria-label="Alt navigasyon"
      >
        <Button 
          variant="ghost" 
          className="flex flex-col items-center gap-0.5 h-auto py-2"
          onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
        >
          <PanelLeft className="h-5 w-5" />
          <span className="text-[10px]">Filtreler</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex flex-col items-center gap-0.5 h-auto py-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-[10px]">Harita</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex flex-col items-center gap-0.5 h-auto py-2 relative"
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
        >
          <div className="relative">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </div>
          <span className="text-[10px]">Bildirimler</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex flex-col items-center gap-0.5 h-auto py-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[10px]">Profil</span>
        </Button>
      </nav>
    </div>
  )
}
