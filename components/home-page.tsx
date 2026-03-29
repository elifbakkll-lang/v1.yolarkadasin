"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Header, type UserType } from "./header"
import { FilterSidebar, type FilterState } from "./filter-sidebar"
import { MapView } from "./map-view"
import { NotificationPanel, type Notification } from "./notification-panel"
import { ReportModal } from "./report-modal"
import { RoutePlanner } from "./route-planner"
import { Button } from "@/components/ui/button"
import { 
  PanelLeftClose, 
  PanelRightClose,
  PanelLeft,
  PanelRight,
  Camera,
  Building2,
  Navigation
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

// Sample notifications with images - different for each user type
const volunteerNotifications: Notification[] = [
  {
    id: "1",
    type: "warning",
    title: "Asansor Arizasi",
    message: "Taksim Metro Istasyonu asansoru gecici olarak hizmet disidir. Alternatif rota onerilir.",
    location: "Taksim, Istanbul",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    imageAlt: "Arizali asansor fotografi",
  },
  {
    id: "2",
    type: "warning",
    title: "Kaldirim Engeli",
    message: "Besiktas Meydani cevresinde kaldirim cokme sorunu mevcut. Tekerlekli sandalye kullanicilari dikkatli olmali.",
    location: "Besiktas, Istanbul",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    read: false,
    image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&h=300&fit=crop",
    imageAlt: "Bozuk kaldirim fotografi",
  },
  {
    id: "3",
    type: "success",
    title: "Raporunuz Onaylandi",
    message: "Kadikoy Sahil yoluna gonderdiginiz rampa raporu dogrulandi ve haritaya eklendi.",
    location: "Kadikoy, Istanbul",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    read: false,
  },
  {
    id: "4",
    type: "info",
    title: "Iyilik Puani Kazandiniz",
    message: "Mekan fotografi paylasIminiz icin 50 iyilik puani kazandiniz!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    read: true,
  },
]

const disabledUserNotifications: Notification[] = [
  {
    id: "d1",
    type: "volunteer_report",
    title: "Asansor Arizasi Bildirimi",
    message: "Taksim Metro Istasyonu asansoru arizali. Belediye bilgilendirildi.",
    location: "Taksim, Istanbul",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    imageAlt: "Asansor fotografi",
    reportedBy: "Mehmet K.",
    status: "in_progress",
  },
  {
    id: "d2",
    type: "volunteer_report",
    title: "Yeni Rampa Eklendi",
    message: "Kadikoy Sahil yoluna yeni engelli rampasi eklendi ve fotograflandi.",
    location: "Kadikoy, Istanbul",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&h=300&fit=crop",
    imageAlt: "Yeni rampa fotografi",
    reportedBy: "Ayse T.",
    status: "resolved",
  },
  {
    id: "d3",
    type: "warning",
    title: "Kaldirim Uyarisi",
    message: "Besiktas Meydani cevresinde kaldirim cokme sorunu. Dikkatli olunuz.",
    location: "Besiktas, Istanbul",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    read: true,
    image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&h=300&fit=crop",
    imageAlt: "Bozuk kaldirim fotografi",
    reportedBy: "Ali R.",
    status: "pending",
  },
  {
    id: "d4",
    type: "success",
    title: "Sorun Cozuldu",
    message: "Sisli Metro cikisi rampa sorunu belediye tarafindan giderildi.",
    location: "Sisli, Istanbul",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    status: "resolved",
  },
]

export function HomePage() {
  const [userType, setUserType] = useState<UserType>("volunteer")
  const [filters, setFilters] = useState<FilterState>({
    disabilityTypes: [],
    poiTypes: [],
    routePreferences: [],
  })

  const [notifications, setNotifications] = useState<Notification[]>(volunteerNotifications)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [routePlannerOpen, setRoutePlannerOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name: string } | undefined>()
  const [activeRoute, setActiveRoute] = useState<unknown>(null)

  const handleUserTypeChange = useCallback((type: UserType) => {
    setUserType(type)
    // Change notifications based on user type
    setNotifications(type === "volunteer" ? volunteerNotifications : disabledUserNotifications)
  }, [])

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

  const handleMarkResolved = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, status: "resolved" as const } : n)
    )
  }, [])

  const handleLocationSelect = useCallback((location: { lat: number; lng: number; name: string }) => {
    setSelectedLocation(location)
  }, [])

  const handleCreateRoute = useCallback(() => {
    setRoutePlannerOpen(true)
  }, [])

  const handleRouteSelect = useCallback((route: unknown) => {
    setActiveRoute(route)
    // Close route planner and show route on map
  }, [])

  // Different floating button based on user type
  const FloatingButtonContent = userType === "volunteer" ? (
    <>
      <Camera className="h-6 w-6" />
      <span className="sr-only">Fotograf cekerek rapor gonder</span>
    </>
  ) : (
    <>
      <Building2 className="h-6 w-6" />
      <span className="sr-only">Belediyeye bildir</span>
    </>
  )

  const floatingButtonTooltip = userType === "volunteer" 
    ? "Sorun fotografla ve raporla" 
    : "Erisilebilirlik merkezi"

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col bg-background">
        {/* Header */}
        <Header 
          showMenuButton={true}
          onMenuToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
          userType={userType}
          onUserTypeChange={handleUserTypeChange}
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
                onCreateRoute={handleCreateRoute}
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
              activeRoute={activeRoute}
            />

            {/* Floating Route Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="lg"
                  className="absolute bottom-24 md:bottom-20 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 h-12 px-6 rounded-full shadow-xl hover:scale-105 transition-transform bg-chart-2 hover:bg-chart-2/90"
                  onClick={() => setRoutePlannerOpen(true)}
                  aria-label="Rota planla"
                >
                  <Navigation className="h-5 w-5 mr-2" />
                  Rota Planla
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Eriselebilir rota olustur</p>
              </TooltipContent>
            </Tooltip>

            {/* Floating Report Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="lg"
                  className={cn(
                    "absolute bottom-24 md:bottom-6 right-6 h-14 w-14 rounded-full shadow-xl hover:scale-105 transition-transform",
                    userType === "disabled" && "bg-primary hover:bg-primary/90"
                  )}
                  onClick={() => setReportModalOpen(true)}
                  aria-label={floatingButtonTooltip}
                >
                  {FloatingButtonContent}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{floatingButtonTooltip}</p>
              </TooltipContent>
            </Tooltip>

            {/* Active Route Indicator */}
            {activeRoute && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 z-10">
                <div className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-lg">
                  <Navigation className="h-4 w-4 animate-pulse" />
                  <span className="text-sm font-medium">Rota aktif</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full hover:bg-primary-foreground/20"
                    onClick={() => setActiveRoute(null)}
                  >
                    <span className="sr-only">Rotayi kapat</span>
                    <span className="text-xs">X</span>
                  </Button>
                </div>
              </div>
            )}

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
                onMarkResolved={handleMarkResolved}
                userType={userType}
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
            onClick={() => setRoutePlannerOpen(true)}
          >
            <Navigation className="h-5 w-5" />
            <span className="text-[10px]">Rota</span>
          </Button>
          
          {/* Report Button - Mobile */}
          <Button 
            className={cn(
              "flex flex-col items-center gap-0.5 h-auto py-2 px-4",
              userType === "volunteer" 
                ? "bg-primary hover:bg-primary/90" 
                : "bg-chart-2 hover:bg-chart-2/90"
            )}
            onClick={() => setReportModalOpen(true)}
          >
            {userType === "volunteer" ? (
              <Camera className="h-5 w-5" />
            ) : (
              <Building2 className="h-5 w-5" />
            )}
            <span className="text-[10px]">{userType === "volunteer" ? "Raporla" : "Bildir"}</span>
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
            <span className="text-[10px]">{userType === "disabled" ? "Takip" : "Bildirim"}</span>
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
          userType={userType}
        />

        {/* Route Planner Modal */}
        <RoutePlanner
          open={routePlannerOpen}
          onOpenChange={setRoutePlannerOpen}
          filters={filters}
          startLocation={selectedLocation}
          onRouteSelect={handleRouteSelect}
        />
      </div>
    </TooltipProvider>
  )
}
