"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { 
  Plus, 
  Minus, 
  Locate, 
  Layers,
  Navigation,
  Search,
  X
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
  { id: "1", lat: 41.0082, lng: 28.9784, type: "cafe", name: "Erişilebilir Kafe", accessible: true, details: "Rampa ve engelli tuvaleti mevcut" },
  { id: "2", lat: 41.0122, lng: 28.9760, type: "hospital", name: "Şehir Hastanesi", accessible: true, details: "Tam erişilebilir, asansörlü" },
  { id: "3", lat: 41.0055, lng: 28.9830, type: "elevator", name: "Metro Asansörü", accessible: true, details: "24 saat aktif" },
  { id: "4", lat: 41.0100, lng: 28.9700, type: "toilet", name: "Engelli Tuvaleti", accessible: true, details: "Belediye tarafından işletiliyor" },
  { id: "5", lat: 41.0070, lng: 28.9750, type: "parking", name: "Engelli Parkı", accessible: true, details: "3 araçlık kapasite" },
  { id: "6", lat: 41.0140, lng: 28.9820, type: "ramp", name: "Kaldırım Rampası", accessible: true, details: "Yeni yapılmış" },
  { id: "7", lat: 41.0090, lng: 28.9680, type: "restaurant", name: "Aile Restoranı", accessible: true, details: "Geniş koridorlar" },
  { id: "8", lat: 41.0030, lng: 28.9770, type: "pharmacy", name: "7/24 Eczane", accessible: true, details: "Rampa girişi mevcut" },
]

const mapStyles = [
  { id: "standard", label: "Standart" },
  { id: "satellite", label: "Uydu" },
  { id: "accessibility", label: "Erişilebilirlik" },
]

export function MapView({ filters, className, onLocationSelect }: MapViewProps) {
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
        (error) => {
          console.error("Konum alınamadı:", error)
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
      case "cafe": return "☕"
      case "restaurant": return "🍽️"
      case "hospital": return "🏥"
      case "pharmacy": return "💊"
      case "toilet": return "🚻"
      case "elevator": return "🛗"
      case "ramp": return "♿"
      case "parking": return "🅿️"
      default: return "📍"
    }
  }

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
              aria-label="Aramayı temizle"
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

        {/* Markers */}
        <div className="absolute inset-0">
          {filteredMarkers.map((marker, index) => {
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
                  <span className="text-lg" role="img" aria-hidden="true">
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

      {/* Selected Marker Info */}
      {selectedMarker && (
        <div className="absolute bottom-24 left-4 right-4 z-10 md:left-6 md:right-auto md:w-80">
          <div className="rounded-xl bg-card p-4 shadow-xl border">
            <div className="flex items-start gap-3">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-lg text-2xl",
                getMarkerColor(selectedMarker.type)
              )}>
                {getMarkerIcon(selectedMarker.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{selectedMarker.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{selectedMarker.details}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    ♿ Erişilebilir
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
            aria-label="Yakınlaştır"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <div className="h-px bg-border" />
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none hover:bg-accent"
            onClick={handleZoomOut}
            aria-label="Uzaklaştır"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-6 left-6 z-10 rounded-full bg-card/80 px-3 py-1.5 text-xs font-medium shadow backdrop-blur">
        Yakınlık: {zoom}x
      </div>

      {/* Accessibility mode indicator */}
      {filters.disabilityTypes.length > 0 && (
        <div className="absolute top-20 left-6 z-10 rounded-lg bg-primary/90 px-3 py-2 text-sm font-medium text-primary-foreground shadow-lg backdrop-blur md:top-4 md:left-auto md:right-6">
          <span className="flex items-center gap-2">
            ♿ Erişilebilirlik modu aktif
          </span>
        </div>
      )}
    </div>
  )
}
