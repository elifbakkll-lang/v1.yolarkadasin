"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Header } from "./header"
import { FilterSidebar, type FilterState } from "./filter-sidebar"
import { MapView } from "./map-view"
import { NotificationPanel, type Notification } from "./notification-panel"
import { ReportModal } from "./report-modal"
import { Button } from "@/components/ui/button"
import { 
  PanelLeftClose, 
  PanelRightClose,
  PanelLeft,
  PanelRight,
  AlertTriangle,
  Plus
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Partner organizations/NGOs
const partnerOrganizations = [
  { id: "1", name: "Engelsiz Yasam Dernegi", logo: "/partners/engelsiz.svg", color: "#0ea5e9" },
  { id: "2", name: "Turkiye Sakatlar Dernegi", logo: "/partners/tsd.svg", color: "#22c55e" },
  { id: "3", name: "Gorme Engelliler Federasyonu", logo: "/partners/gef.svg", color: "#f59e0b" },
  { id: "4", name: "Isitme Engelliler Dernegi", logo: "/partners/ied.svg", color: "#8b5cf6" },
]

// Sample notifications with images
const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "warning",
    title: "Asansor Arizasi",
    message: "Taksim Metro Istasyonu asansoru gecici olarak hizmet disIdir. Alternatif rota onerilir.",
    location: "Taksim, Istanbul",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    imageAlt: "Arizali asansor fotografI",
  },
  {
    id: "2",
    type: "warning",
    title: "Kaldirim Engeli",
    message: "Besiktas Meydani cevresinde kaldirim cokme sorunu mevcut. Tekerlekli sandalye kullanIcIlarI dikkatli olmalI.",
    location: "Besiktas, Istanbul",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    read: false,
    image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&h=300&fit=crop",
    imageAlt: "Bozuk kaldirim fotografI",
  },
  {
    id: "3",
    type: "success",
    title: "Yeni Rampa Eklendi",
    message: "Kadikoy Sahil yoluna yeni engelli rampasi eklendi ve dogrulandi.",
    location: "Kadikoy, Istanbul",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    read: false,
    image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&h=300&fit=crop",
    imageAlt: "Yeni yapilmis engelli rampasi",
  },
  {
    id: "4",
    type: "info",
    title: "Iyilik Puani Kazandiniz",
    message: "Mekan fotografI paylasIminIz icin 50 iyilik puani kazandiniz!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    read: true,
  },
  {
    id: "5",
    type: "warning",
    title: "Engelli Park Ihlali",
    message: "Sisli Mesrutiyet Caddesi uzerinde engelli park yerine normal arac park etmis durumda.",
    location: "Sisli, Istanbul",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    read: true,
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&h=300&fit=crop",
    imageAlt: "Park ihlali fotografI",
  },
  {
    id: "6",
    type: "success",
    title: "Rota Onaylandi",
    message: "Paylastiginiz erisilebilir rota topluluk tarafIndan dogrulandi.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
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
  const [reportModalOpen, setReportModalOpen] = useState(false)

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
    // Handle location selection
  }, [])

  return (
    <TooltipProvider>
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
              aria-label={leftSidebarOpen ? "Filtreleri gizle" : "Filtreleri goster"}
            >
              {leftSidebarOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Map */}
          <div className="relative flex-1">
            <MapView 
              filters={filters}
              onLocationSelect={handleLocationSelect}
              className="h-full"
            />

            {/* Floating Report Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="lg"
                  className="absolute bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-24 md:translate-x-0 h-14 w-14 rounded-full shadow-xl hover:scale-105 transition-transform"
                  onClick={() => setReportModalOpen(true)}
                  aria-label="Belediyeye bildir"
                >
                  <AlertTriangle className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Erisilebilirlik sorunu bildir</p>
              </TooltipContent>
            </Tooltip>

            {/* Partner Organizations Strip */}
            <div className="absolute bottom-6 left-6 hidden md:block">
              <div className="flex items-center gap-3 rounded-xl bg-card/95 backdrop-blur px-4 py-2 shadow-lg border">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Is Ortaklarimiz:</span>
                <div className="flex items-center gap-2">
                  {partnerOrganizations.map((org) => (
                    <Tooltip key={org.id}>
                      <TooltipTrigger asChild>
                        <button 
                          className="flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110"
                          style={{ backgroundColor: `${org.color}20` }}
                        >
                          <span 
                            className="text-xs font-bold"
                            style={{ color: org.color }}
                          >
                            {org.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                          </span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{org.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Toggle button for right panel */}
          <div className="hidden md:flex items-start pt-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-l-lg rounded-r-none border border-r-0 border-border bg-card hover:bg-accent"
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              aria-label={rightPanelOpen ? "Bildirimleri gizle" : "Bildirimleri goster"}
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
          
          {/* Report Button - Mobile */}
          <Button 
            className="flex flex-col items-center gap-0.5 h-auto py-2 px-4 bg-primary hover:bg-primary/90"
            onClick={() => setReportModalOpen(true)}
          >
            <AlertTriangle className="h-5 w-5" />
            <span className="text-[10px]">Bildir</span>
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

        {/* Report Modal */}
        <ReportModal 
          open={reportModalOpen} 
          onOpenChange={setReportModalOpen} 
        />
      </div>
    </TooltipProvider>
  )
}
