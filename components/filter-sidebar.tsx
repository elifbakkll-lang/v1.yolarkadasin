"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { 
  Accessibility, 
  Eye, 
  Ear, 
  Brain, 
  Baby,
  HandHelping,
  ChevronDown,
  Filter,
  RotateCcw,
  MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export interface FilterState {
  disabilityTypes: string[]
  poiTypes: string[]
  routePreferences: string[]
}

interface FilterSidebarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  className?: string
}

const disabilityGroups = [
  { id: "wheelchair", label: "Tekerlekli Sandalye", icon: Accessibility, color: "text-primary" },
  { id: "visually-impaired", label: "Görme Engelli", icon: Eye, color: "text-chart-2" },
  { id: "hearing-impaired", label: "İşitme Engelli", icon: Ear, color: "text-chart-3" },
  { id: "cognitive", label: "Bilişsel Engel", icon: Brain, color: "text-chart-4" },
  { id: "elderly", label: "Yaşlı Bireyler", icon: HandHelping, color: "text-chart-5" },
  { id: "stroller", label: "Bebek Arabası", icon: Baby, color: "text-accent" },
]

const poiTypes = [
  { id: "cafe", label: "Kafeler" },
  { id: "restaurant", label: "Restoranlar" },
  { id: "hospital", label: "Hastaneler" },
  { id: "pharmacy", label: "Eczaneler" },
  { id: "toilet", label: "Engelli Tuvaletleri" },
  { id: "elevator", label: "Asansörler" },
  { id: "ramp", label: "Rampalar" },
  { id: "parking", label: "Engelli Parkları" },
]

const routePreferences = [
  { id: "no-stairs", label: "Merdivensiz" },
  { id: "flat-surface", label: "Düz Zemin" },
  { id: "wide-sidewalk", label: "Geniş Kaldırım" },
  { id: "audio-signals", label: "Sesli Sinyaller" },
  { id: "tactile-paving", label: "Hissedilebilir Yüzey" },
]

export function FilterSidebar({ filters, onFiltersChange, className }: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState({
    disability: true,
    poi: true,
    route: false,
  })

  const toggleDisabilityType = (id: string) => {
    const newTypes = filters.disabilityTypes.includes(id)
      ? filters.disabilityTypes.filter(t => t !== id)
      : [...filters.disabilityTypes, id]
    onFiltersChange({ ...filters, disabilityTypes: newTypes })
  }

  const togglePoiType = (id: string) => {
    const newTypes = filters.poiTypes.includes(id)
      ? filters.poiTypes.filter(t => t !== id)
      : [...filters.poiTypes, id]
    onFiltersChange({ ...filters, poiTypes: newTypes })
  }

  const toggleRoutePreference = (id: string) => {
    const newPrefs = filters.routePreferences.includes(id)
      ? filters.routePreferences.filter(t => t !== id)
      : [...filters.routePreferences, id]
    onFiltersChange({ ...filters, routePreferences: newPrefs })
  }

  const resetFilters = () => {
    onFiltersChange({
      disabilityTypes: [],
      poiTypes: [],
      routePreferences: [],
    })
  }

  const activeFiltersCount = 
    filters.disabilityTypes.length + 
    filters.poiTypes.length + 
    filters.routePreferences.length

  return (
    <aside 
      className={cn(
        "flex h-full w-80 flex-col bg-sidebar text-sidebar-foreground",
        className
      )}
      aria-label="Filtreler"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-sidebar-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Filtreler</h2>
          {activeFiltersCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary px-1.5 text-xs font-medium text-sidebar-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="h-8 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          disabled={activeFiltersCount === 0}
        >
          <RotateCcw className="mr-1 h-3 w-3" aria-hidden="true" />
          Sıfırla
        </Button>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {/* Disability Types */}
          <Collapsible
            open={openSections.disability}
            onOpenChange={(open) => setOpenSections(s => ({ ...s, disability: open }))}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left font-medium hover:bg-sidebar-accent transition-colors">
              <span className="flex items-center gap-2">
                <Accessibility className="h-4 w-4 text-sidebar-primary" aria-hidden="true" />
                Engel Grupları
              </span>
              <ChevronDown 
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  openSections.disability && "rotate-180"
                )} 
                aria-hidden="true"
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pt-2">
              {disabilityGroups.map((group) => {
                const Icon = group.icon
                const isChecked = filters.disabilityTypes.includes(group.id)
                return (
                  <div
                    key={group.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors cursor-pointer",
                      isChecked 
                        ? "bg-sidebar-accent" 
                        : "hover:bg-sidebar-accent/50"
                    )}
                    onClick={() => toggleDisabilityType(group.id)}
                    role="checkbox"
                    aria-checked={isChecked}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        toggleDisabilityType(group.id)
                      }
                    }}
                  >
                    <Checkbox 
                      id={group.id}
                      checked={isChecked}
                      onCheckedChange={() => toggleDisabilityType(group.id)}
                      className="border-sidebar-border data-[state=checked]:bg-sidebar-primary data-[state=checked]:border-sidebar-primary"
                    />
                    <Icon className={cn("h-4 w-4", group.color)} aria-hidden="true" />
                    <Label 
                      htmlFor={group.id}
                      className="flex-1 cursor-pointer text-sm font-normal"
                    >
                      {group.label}
                    </Label>
                  </div>
                )
              })}
            </CollapsibleContent>
          </Collapsible>

          {/* POI Types */}
          <Collapsible
            open={openSections.poi}
            onOpenChange={(open) => setOpenSections(s => ({ ...s, poi: open }))}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left font-medium hover:bg-sidebar-accent transition-colors">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sidebar-primary" aria-hidden="true" />
                Mekan Türleri
              </span>
              <ChevronDown 
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  openSections.poi && "rotate-180"
                )} 
                aria-hidden="true"
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pt-2">
              {poiTypes.map((poi) => {
                const isChecked = filters.poiTypes.includes(poi.id)
                return (
                  <div
                    key={poi.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors cursor-pointer",
                      isChecked 
                        ? "bg-sidebar-accent" 
                        : "hover:bg-sidebar-accent/50"
                    )}
                    onClick={() => togglePoiType(poi.id)}
                    role="checkbox"
                    aria-checked={isChecked}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        togglePoiType(poi.id)
                      }
                    }}
                  >
                    <Checkbox 
                      id={`poi-${poi.id}`}
                      checked={isChecked}
                      onCheckedChange={() => togglePoiType(poi.id)}
                      className="border-sidebar-border data-[state=checked]:bg-sidebar-primary data-[state=checked]:border-sidebar-primary"
                    />
                    <Label 
                      htmlFor={`poi-${poi.id}`}
                      className="flex-1 cursor-pointer text-sm font-normal"
                    >
                      {poi.label}
                    </Label>
                  </div>
                )
              })}
            </CollapsibleContent>
          </Collapsible>

          {/* Route Preferences */}
          <Collapsible
            open={openSections.route}
            onOpenChange={(open) => setOpenSections(s => ({ ...s, route: open }))}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left font-medium hover:bg-sidebar-accent transition-colors">
              <span className="flex items-center gap-2">
                <svg 
                  className="h-4 w-4 text-sidebar-primary" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Rota Tercihleri
              </span>
              <ChevronDown 
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  openSections.route && "rotate-180"
                )} 
                aria-hidden="true"
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pt-2">
              {routePreferences.map((pref) => {
                const isChecked = filters.routePreferences.includes(pref.id)
                return (
                  <div
                    key={pref.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors cursor-pointer",
                      isChecked 
                        ? "bg-sidebar-accent" 
                        : "hover:bg-sidebar-accent/50"
                    )}
                    onClick={() => toggleRoutePreference(pref.id)}
                    role="checkbox"
                    aria-checked={isChecked}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        toggleRoutePreference(pref.id)
                      }
                    }}
                  >
                    <Checkbox 
                      id={`route-${pref.id}`}
                      checked={isChecked}
                      onCheckedChange={() => toggleRoutePreference(pref.id)}
                      className="border-sidebar-border data-[state=checked]:bg-sidebar-primary data-[state=checked]:border-sidebar-primary"
                    />
                    <Label 
                      htmlFor={`route-${pref.id}`}
                      className="flex-1 cursor-pointer text-sm font-normal"
                    >
                      {pref.label}
                    </Label>
                  </div>
                )
              })}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <Button 
          className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
          size="lg"
        >
          <MapPin className="mr-2 h-4 w-4" aria-hidden="true" />
          Rota Oluştur
        </Button>
      </div>
    </aside>
  )
}
