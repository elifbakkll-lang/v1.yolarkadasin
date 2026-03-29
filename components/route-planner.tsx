"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  MapPin,
  Navigation,
  Clock,
  Footprints,
  Bus,
  Train,
  Car,
  Accessibility,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ArrowRight,
  Check,
  AlertTriangle,
  X,
  Locate
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { FilterState } from "./filter-sidebar"

interface RouteStep {
  id: string
  type: "walk" | "bus" | "metro" | "tram" | "ferry" | "transfer"
  instruction: string
  distance: string
  duration: string
  accessible: boolean
  accessibilityNotes?: string
  line?: string
  lineColor?: string
  from?: string
  to?: string
  warning?: string
}

interface Route {
  id: string
  name: string
  totalDuration: string
  totalDistance: string
  accessibilityScore: number
  steps: RouteStep[]
  transportTypes: string[]
  warnings?: string[]
}

interface RoutePlannerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: FilterState
  startLocation?: { lat: number; lng: number; name: string }
  endLocation?: { lat: number; lng: number; name: string }
  onRouteSelect?: (route: Route) => void
}

// Ornek rotalar - erisilebilik tercihlerine gore
const generateRoutes = (filters: FilterState): Route[] => {
  const baseRoutes: Route[] = [
    {
      id: "1",
      name: "En Hizli Eriselebilir Rota",
      totalDuration: "28 dk",
      totalDistance: "4.2 km",
      accessibilityScore: 95,
      transportTypes: ["metro", "walk"],
      steps: [
        {
          id: "s1",
          type: "walk",
          instruction: "Baslangic noktasindan Taksim Metro istasyonuna yuruyin",
          distance: "350 m",
          duration: "5 dk",
          accessible: true,
          accessibilityNotes: "Duz zemin, genis kaldirim",
        },
        {
          id: "s2",
          type: "metro",
          instruction: "M2 Metro hattina binin",
          distance: "3.2 km",
          duration: "12 dk",
          accessible: true,
          accessibilityNotes: "Asansor mevcut, engelli vagonu 3. vagon",
          line: "M2",
          lineColor: "#00A651",
          from: "Taksim",
          to: "Levent",
        },
        {
          id: "s3",
          type: "walk",
          instruction: "Levent Metro istasyonundan cikis yapin ve hedef noktaya yuruyin",
          distance: "650 m",
          duration: "11 dk",
          accessible: true,
          accessibilityNotes: "Rampa cikis, hissedilebilir yuzey mevcut",
        },
      ],
    },
    {
      id: "2",
      name: "Tamamen Merdivensiz Rota",
      totalDuration: "35 dk",
      totalDistance: "5.1 km",
      accessibilityScore: 100,
      transportTypes: ["bus", "walk"],
      steps: [
        {
          id: "s1",
          type: "walk",
          instruction: "En yakin otobus duragina yuruyin (rampa mevcut)",
          distance: "200 m",
          duration: "4 dk",
          accessible: true,
          accessibilityNotes: "Tamamen duz zemin",
        },
        {
          id: "s2",
          type: "bus",
          instruction: "34BZ hattina binin (alak tabli otobus)",
          distance: "4.5 km",
          duration: "22 dk",
          accessible: true,
          accessibilityNotes: "Alcak tabanli, rampa sistemi mevcut, engelli koltuklari on tarafta",
          line: "34BZ",
          lineColor: "#E31837",
          from: "Mecidiyekoy",
          to: "Levent Sanayi",
        },
        {
          id: "s3",
          type: "walk",
          instruction: "Duraktan hedef noktaya yuruyin",
          distance: "400 m",
          duration: "9 dk",
          accessible: true,
          accessibilityNotes: "Genis kaldirim, rampali gecisler",
        },
      ],
    },
    {
      id: "3",
      name: "Sesli Sinyalli Guzergah",
      totalDuration: "32 dk",
      totalDistance: "4.8 km",
      accessibilityScore: 92,
      transportTypes: ["tram", "walk"],
      warnings: ["Saat 17:00-19:00 arasi kalabalik olabilir"],
      steps: [
        {
          id: "s1",
          type: "walk",
          instruction: "Kabatas tramvay duragina yuruyin",
          distance: "300 m",
          duration: "6 dk",
          accessible: true,
          accessibilityNotes: "Sesli trafik isiklari mevcut, hissedilebilir yuzey",
        },
        {
          id: "s2",
          type: "tram",
          instruction: "T1 tramvayina binin",
          distance: "3.8 km",
          duration: "18 dk",
          accessible: true,
          accessibilityNotes: "Sesli anonslar, alcak platform",
          line: "T1",
          lineColor: "#0078D4",
          from: "Kabatas",
          to: "Karakoy",
        },
        {
          id: "s3",
          type: "walk",
          instruction: "Duraktan hedefe yuruyin",
          distance: "700 m",
          duration: "8 dk",
          accessible: true,
          accessibilityNotes: "Sesli uyari sistemleri mevcut",
          warning: "Insaat calismasi - alternatif yol onerilir",
        },
      ],
    },
  ]

  // Filtrelere gore rotaları sirala
  if (filters.routePreferences.includes("no-stairs")) {
    // Merdivensiz rotayi one al
    const noStairsRoute = baseRoutes.find(r => r.id === "2")
    if (noStairsRoute) {
      return [noStairsRoute, ...baseRoutes.filter(r => r.id !== "2")]
    }
  }

  if (filters.routePreferences.includes("audio-signals")) {
    // Sesli sinyalli rotayi one al
    const audioRoute = baseRoutes.find(r => r.id === "3")
    if (audioRoute) {
      return [audioRoute, ...baseRoutes.filter(r => r.id !== "3")]
    }
  }

  return baseRoutes
}

const transportIcons: Record<string, React.ReactNode> = {
  walk: <Footprints className="h-4 w-4" />,
  bus: <Bus className="h-4 w-4" />,
  metro: <Train className="h-4 w-4" />,
  tram: <Train className="h-4 w-4" />,
  ferry: <Car className="h-4 w-4" />,
  transfer: <ArrowRight className="h-4 w-4" />,
}

export function RoutePlanner({
  open,
  onOpenChange,
  filters,
  startLocation,
  endLocation,
  onRouteSelect,
}: RoutePlannerProps) {
  const [start, setStart] = useState(startLocation?.name || "")
  const [end, setEnd] = useState(endLocation?.name || "")
  const [routes, setRoutes] = useState<Route[]>([])
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    if (startLocation) setStart(startLocation.name)
    if (endLocation) setEnd(endLocation.name)
  }, [startLocation, endLocation])

  const handleCalculateRoute = () => {
    if (!start || !end) return

    setIsCalculating(true)
    // Simulate route calculation
    setTimeout(() => {
      const calculatedRoutes = generateRoutes(filters)
      setRoutes(calculatedRoutes)
      setExpandedRoute(calculatedRoutes[0]?.id || null)
      setIsCalculating(false)
    }, 1000)
  }

  const handleSelectRoute = (route: Route) => {
    setSelectedRoute(route)
    onRouteSelect?.(route)
    onOpenChange(false)
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setStart("Mevcut Konumum")
        },
        () => {
          // Silently fail
        }
      )
    }
  }

  const swapLocations = () => {
    const temp = start
    setStart(end)
    setEnd(temp)
  }

  const getAccessibilityColor = (score: number) => {
    if (score >= 90) return "text-primary bg-primary/10"
    if (score >= 70) return "text-accent bg-accent/10"
    return "text-destructive bg-destructive/10"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Navigation className="h-5 w-5 text-primary" />
            Eriselebilir Rota Planlayici
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* Location Inputs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <div className="w-0.5 h-8 bg-border" />
                <div className="h-3 w-3 rounded-full bg-destructive" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="relative">
                  <Input
                    placeholder="Baslangic noktasi"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={handleUseCurrentLocation}
                    aria-label="Mevcut konumu kullan"
                  >
                    <Locate className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                <Input
                  placeholder="Varis noktasi"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={swapLocations}
                aria-label="Konumlari degistir"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active Accessibility Preferences */}
          {filters.routePreferences.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Tercihler:</span>
              {filters.routePreferences.map((pref) => (
                <Badge key={pref} variant="secondary" className="text-xs">
                  <Accessibility className="h-3 w-3 mr-1" />
                  {pref === "no-stairs" && "Merdivensiz"}
                  {pref === "flat-surface" && "Duz Zemin"}
                  {pref === "wide-sidewalk" && "Genis Kaldirim"}
                  {pref === "audio-signals" && "Sesli Sinyaller"}
                  {pref === "tactile-paving" && "Hissedilebilir Yuzey"}
                </Badge>
              ))}
            </div>
          )}

          {/* Calculate Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={handleCalculateRoute}
            disabled={!start || !end || isCalculating}
          >
            {isCalculating ? (
              <>
                <span className="animate-spin mr-2">
                  <RotateCcw className="h-4 w-4" />
                </span>
                Rota hesaplaniyor...
              </>
            ) : (
              <>
                <Navigation className="h-4 w-4 mr-2" />
                Eriselebilir Rota Olustur
              </>
            )}
          </Button>
        </div>

        {/* Routes List */}
        {routes.length > 0 && (
          <ScrollArea className="max-h-[400px] border-t">
            <div className="p-4 space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground px-2">
                {routes.length} eriselebilir rota bulundu
              </h3>

              {routes.map((route) => (
                <div
                  key={route.id}
                  className={cn(
                    "rounded-xl border bg-card overflow-hidden transition-all",
                    expandedRoute === route.id && "ring-2 ring-primary"
                  )}
                >
                  {/* Route Header */}
                  <button
                    className="w-full p-4 text-left"
                    onClick={() => setExpandedRoute(
                      expandedRoute === route.id ? null : route.id
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold truncate">{route.name}</h4>
                          <Badge className={cn("text-xs", getAccessibilityColor(route.accessibilityScore))}>
                            {route.accessibilityScore}% Eriselebilir
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {route.totalDuration}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {route.totalDistance}
                          </span>
                        </div>
                        {/* Transport Types */}
                        <div className="flex items-center gap-1 mt-2">
                          {route.transportTypes.map((type, i) => (
                            <span key={i} className="flex items-center">
                              <span className="p-1.5 rounded-md bg-muted">
                                {transportIcons[type]}
                              </span>
                              {i < route.transportTypes.length - 1 && (
                                <ArrowRight className="h-3 w-3 mx-1 text-muted-foreground" />
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {expandedRoute === route.id ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* Warnings */}
                    {route.warnings && route.warnings.length > 0 && (
                      <div className="mt-3 flex items-start gap-2 p-2 rounded-lg bg-accent/10 text-accent text-sm">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{route.warnings[0]}</span>
                      </div>
                    )}
                  </button>

                  {/* Route Steps (Expanded) */}
                  {expandedRoute === route.id && (
                    <div className="border-t">
                      <div className="p-4 space-y-4">
                        {route.steps.map((step, index) => (
                          <div key={step.id} className="relative">
                            {/* Connector Line */}
                            {index < route.steps.length - 1 && (
                              <div className="absolute left-5 top-10 w-0.5 h-full bg-border" />
                            )}

                            <div className="flex gap-3">
                              {/* Step Icon */}
                              <div className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                                step.type === "walk" ? "bg-muted" : "bg-primary/10"
                              )}>
                                {step.line ? (
                                  <span 
                                    className="text-xs font-bold text-white rounded-full px-1.5 py-0.5"
                                    style={{ backgroundColor: step.lineColor }}
                                  >
                                    {step.line}
                                  </span>
                                ) : (
                                  <span className="text-foreground">
                                    {transportIcons[step.type]}
                                  </span>
                                )}
                              </div>

                              {/* Step Content */}
                              <div className="flex-1 min-w-0 pb-4">
                                <p className="font-medium text-sm">{step.instruction}</p>
                                
                                {step.from && step.to && (
                                  <p className="text-sm text-muted-foreground mt-0.5">
                                    {step.from} → {step.to}
                                  </p>
                                )}

                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                  <span>{step.distance}</span>
                                  <span>{step.duration}</span>
                                </div>

                                {/* Accessibility Notes */}
                                {step.accessibilityNotes && (
                                  <div className="flex items-start gap-1.5 mt-2 text-xs text-primary">
                                    <Check className="h-3 w-3 shrink-0 mt-0.5" />
                                    <span>{step.accessibilityNotes}</span>
                                  </div>
                                )}

                                {/* Step Warning */}
                                {step.warning && (
                                  <div className="flex items-start gap-1.5 mt-2 text-xs text-accent">
                                    <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
                                    <span>{step.warning}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Select Route Button */}
                      <div className="p-4 pt-0">
                        <Button
                          className="w-full"
                          onClick={() => handleSelectRoute(route)}
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Bu Rotayi Kullan
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
