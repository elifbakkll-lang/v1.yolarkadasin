"use client"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { 
  Plus, 
  Minus, 
  Locate, 
  Layers,
  Navigation,
  Search,
  X,
  Clock,
  Footprints,
  Bus,
  Train
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { FilterState } from "./filter-sidebar"

interface MapViewProps {
  filters: FilterState
  className?: string
  onLocationSelect?: (location: { lat: number; lng: number; name: string }) => void
  activeRoute?: unknown
}

interface MapMarker {
  id: string
  lat: number
  lng: number
  type: string
  name: string
  accessible: boolean
  details?: string
}

// Sample accessible locations in Istanbul
const sampleMarkers: MapMarker[] = [
  { id: "1", lat: 41.0082, lng: 28.9784, type: "cafe", name: "Eriselebilir Kafe", accessible: true, details: "Rampa ve engelli tuvaleti mevcut" },
  { id: "2", lat: 41.0122, lng: 28.9760, type: "hospital", name: "Sehir Hastanesi", accessible: true, details: "Tam eriselebilir, asansorlu" },
  { id: "3", lat: 41.0055, lng: 28.9830, type: "elevator", name: "Metro Asansoru", accessible: true, details: "24 saat aktif" },
  { id: "4", lat: 41.0100, lng: 28.9700, type: "toilet", name: "Engelli Tuvaleti", accessible: true, details: "Belediye tarafindan isletiliyor" },
  { id: "5", lat: 41.0070, lng: 28.9750, type: "parking", name: "Engelli Parki", accessible: true, details: "3 araclik kapasite" },
  { id: "6", lat: 41.0140, lng: 28.9820, type: "ramp", name: "Kaldirim Rampasi", accessible: true, details: "Yeni yapilmis" },
  { id: "7", lat: 41.0090, lng: 28.9680, type: "restaurant", name: "Aile Restorani", accessible: true, details: "Genis koridorlar" },
  { id: "8", lat: 41.0030, lng: 28.9770, type: "pharmacy", name: "7/24 Eczane", accessible: true, details: "Rampa girisi mevcut" },
]

const mapStyles = [
  { id: "standard", label: "Standart" },
  { id: "satellite", label: "Uydu" },
  { id: "accessibility", label: "Eriselebilirlik" },
]

export function MapView({ filters, className, onLocationSelect, activeRoute }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("standard")
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [zoom, setZoom] = useState(14)
  const [center, setCenter] = useState({ lat: 41.0082, lng: 28.9784 })

  // Filter markers based on selected POI types
  const filteredMarkers = sampleMarkers.filter(marker => {
    if (filters.poiTypes.length === 0) return true
    return filters.poiTypes.includes(marker.type)
  })

  const handleZoomIn = () => setZoom(z => Math.min(z + 1, 20))
  const handleZoomOut = () => setZoom(z => Math.max(z - 1, 1))
  
  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        () => {
          // Silently fail - location might not be available
        }
      )
    }
  }

  const getMarkerColor = (type: string) => {
    switch (type) {
      case "cafe": return "bg-amber-500"
      case "restaurant": return "bg-orange-500"
      case "hospital": return "bg-red-500"
      case "pharmacy": return "bg-green-500"
      case "toilet": return "bg-blue-500"
      case "elevator": return "bg-primary"
      case "ramp": return "bg-teal-500"
      case "parking": return "bg-indigo-500"
      default: return "bg-gray-500"
    }
  }

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case "cafe": return "C"
      case "restaurant": return "R"
      case "hospital": return "H"
      case "pharmacy": return "E"
      case "toilet": return "T"
      case "elevator": return "A"
      case "ramp": return "+"
      case "parking": return "P"
      default: return "M"
    }
  }

  // Route visualization data (simulated)
  const routePoints = activeRoute ? [
    { x: 20, y: 70, type: "start" },
    { x: 25, y: 60, type: "walk" },
    { x: 35, y: 50, type: "metro" },
    { x: 55, y: 45, type: "metro" },
    { x: 65, y: 40, type: "walk" },
    { x: 75, y: 35, type: "end" },
  ] : []

  return (
    <div className={cn("relative flex-1 bg-muted overflow-hidden", className)}>
      {/* Search Bar */}
      <div className="absolute left-4 right-4 top-4 z-10 md:left-6 md:right-auto md:w-96">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Konum veya adres ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 pl-10 pr-10 bg-card shadow-lg border-0"
            aria-label="Konum ara"
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-muted"
              onClick={() => setSearchQuery("")}
              aria-label="Aramayi temizle"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Map Container - Simulated with CSS patterns */}
      <div 
        ref={mapRef}
        className="absolute inset-0"
        style={{
          background: selectedStyle === "satellite" 
            ? "linear-gradient(135deg, #1a365d 0%, #2d3748 50%, #1a202c 100%)"
            : selectedStyle === "accessibility"
              ? "linear-gradient(135deg, #e6fffa 0%, #b2f5ea 50%, #81e6d9 100%)"
              : "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 25%, #bbf7d0 50%, #86efac 75%, #4ade80 100%)",
        }}
      >
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${zoom * 3}px ${zoom * 3}px`,
          }}
        />

        {/* Roads simulation */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="4" className="text-foreground/20" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="4" className="text-foreground/20" />
          <line x1="25%" y1="0" x2="75%" y2="100%" stroke="currentColor" strokeWidth="2" className="text-foreground/10" />
          <line x1="75%" y1="0" x2="25%" y2="100%" stroke="currentColor" strokeWidth="2" className="text-foreground/10" />
        </svg>

        {/* Active Route Visualization */}
        {activeRoute && routePoints.length > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
            {/* Route path */}
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--chart-2))" />
              </linearGradient>
              <filter id="routeGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Route line with animation */}
            <polyline
              points={routePoints.map(p => `${p.x}%,${p.y}%`).join(' ')}
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#routeGlow)"
              strokeDasharray="1000"
              strokeDashoffset="0"
              className="animate-pulse"
            />

            {/* Route direction arrows */}
            {routePoints.slice(0, -1).map((point, i) => {
              const nextPoint = routePoints[i + 1]
              const midX = (point.x + nextPoint.x) / 2
              const midY = (point.y + nextPoint.y) / 2
              return (
                <circle
                  key={i}
                  cx={`${midX}%`}
                  cy={`${midY}%`}
                  r="4"
                  fill="white"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                />
              )
            })}
          </svg>
        )}

        {/* Route stop markers */}
        {activeRoute && routePoints.map((point, index) => (
          <div
            key={index}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            {point.type === "start" && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-white">
                <Navigation className="h-5 w-5" />
              </div>
            )}
            {point.type === "end" && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg ring-4 ring-white">
                <div className="h-3 w-3 rounded-full bg-white" />
              </div>
            )}
            {point.type === "metro" && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
                <Train className="h-4 w-4" />
              </div>
            )}
            {point.type === "walk" && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted shadow">
                <Footprints className="h-3 w-3" />
              </div>
            )}
          </div>
        ))}

        {/* Markers */}
        <div className="absolute inset-0">
          {filteredMarkers.map((marker) => {
            // Calculate position based on lat/lng relative to center
            const x = 50 + (marker.lng - center.lng) * zoom * 100
            const y = 50 - (marker.lat - center.lat) * zoom * 100

            if (x < 0 || x > 100 || y < 0 || y > 100) return null

            return (
              <button
                key={marker.id}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                )}
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => {
                  setSelectedMarker(marker)
                  onLocationSelect?.({ lat: marker.lat, lng: marker.lng, name: marker.name })
                }}
                aria-label={`${marker.name}, ${marker.details}`}
              >
                <div 
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110",
                    getMarkerColor(marker.type),
                    selectedMarker?.id === marker.id && "ring-4 ring-white scale-110"
                  )}
                >
                  <span className="text-sm font-bold text-white" role="img" aria-hidden="true">
                    {getMarkerIcon(marker.type)}
                  </span>
                </div>
                {/* Pulse animation for selected */}
                {selectedMarker?.id === marker.id && (
                  <div className={cn(
                    "absolute inset-0 rounded-full animate-ping",
                    getMarkerColor(marker.type),
                    "opacity-30"
                  )} />
                )}
              </button>
            )
          })}
        </div>

        {/* Center marker */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="h-4 w-4 rounded-full border-4 border-primary bg-white shadow-lg" />
        </div>
      </div>

      {/* Route Info Card */}
      {activeRoute && (
        <div className="absolute top-20 left-4 right-4 md:left-6 md:right-auto md:w-80 z-10">
          <div className="rounded-xl bg-card p-4 shadow-xl border">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Navigation className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Eriselebilir Rota Aktif</h3>
                <p className="text-xs text-muted-foreground">En hizli eriselebilir guzergah</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm border-t pt-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  28 dk
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Footprints className="h-4 w-4" />
                  4.2 km
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="p-1 rounded bg-muted">
                  <Footprints className="h-3 w-3" />
                </div>
                <span className="text-xs text-muted-foreground">→</span>
                <div className="p-1 rounded bg-green-100">
                  <Train className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-xs text-muted-foreground">→</span>
                <div className="p-1 rounded bg-muted">
                  <Footprints className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Marker Info */}
      {selectedMarker && !activeRoute && (
        <div className="absolute bottom-24 left-4 right-4 z-10 md:left-6 md:right-auto md:w-80">
          <div className="rounded-xl bg-card p-4 shadow-xl border">
            <div className="flex items-start gap-3">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold text-white",
                getMarkerColor(selectedMarker.type)
              )}>
                {getMarkerIcon(selectedMarker.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{selectedMarker.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{selectedMarker.details}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    + Eriselebilir
                  </span>
                </div>
              </div>
              <button
                className="rounded-full p-1 hover:bg-muted"
                onClick={() => setSelectedMarker(null)}
                aria-label="Kapat"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" className="flex-1">
                <Navigation className="mr-1.5 h-3.5 w-3.5" />
                Yol Tarifi
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                Detaylar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
        {/* Layer selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-card shadow-lg hover:bg-accent"
              aria-label="Harita stili"
            >
              <Layers className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {mapStyles.map((style) => (
              <DropdownMenuItem
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={cn(selectedStyle === style.id && "bg-accent")}
              >
                {style.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Locate button */}
        <Button
          variant="secondary"
          size="icon"
          className="h-10 w-10 rounded-full bg-card shadow-lg hover:bg-accent"
          onClick={handleLocate}
          aria-label="Konumumu bul"
        >
          <Locate className="h-4 w-4" />
        </Button>

        {/* Zoom controls */}
        <div className="flex flex-col rounded-full bg-card shadow-lg overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none hover:bg-accent"
            onClick={handleZoomIn}
            aria-label="Yakinlastir"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <div className="h-px bg-border" />
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none hover:bg-accent"
            onClick={handleZoomOut}
            aria-label="Uzaklastir"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-6 left-6 z-10 rounded-full bg-card/80 px-3 py-1.5 text-xs font-medium shadow backdrop-blur">
        Yakinlik: {zoom}x
      </div>

      {/* Accessibility mode indicator */}
      {filters.disabilityTypes.length > 0 && (
        <div className="absolute top-20 right-6 z-10 rounded-lg bg-primary/90 px-3 py-2 text-sm font-medium text-primary-foreground shadow-lg backdrop-blur md:top-4">
          <span className="flex items-center gap-2">
            + Eriselebilirlik modu aktif
          </span>
        </div>
      )}
    </div>
  )
}
