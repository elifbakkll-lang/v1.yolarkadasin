"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { 
  X, 
  Camera, 
  MapPin, 
  AlertTriangle,
  Construction,
  ParkingCircle,
  Accessibility,
  Send,
  ImagePlus,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const reportCategories = [
  { id: "elevator", label: "Asansor Arizasi", icon: "🛗" },
  { id: "ramp", label: "Rampa Sorunu", icon: "♿" },
  { id: "sidewalk", label: "Kaldirim Engeli", icon: Construction },
  { id: "parking", label: "Engelli Park Ihlali", icon: ParkingCircle },
  { id: "toilet", label: "Engelli Tuvaleti", icon: "🚻" },
  { id: "other", label: "Diger", icon: AlertTriangle },
]

export function ReportModal({ open, onOpenChange }: ReportModalProps) {
  const [step, setStep] = useState<"form" | "success">("form")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [photos, setPhotos] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePhotoUpload = () => {
    // Simulate photo upload
    const mockPhotos = [
      "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
    ]
    setPhotos(prev => [...prev, mockPhotos[prev.length % 2]])
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setStep("success")
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset form after modal closes
    setTimeout(() => {
      setStep("form")
      setSelectedCategory("")
      setLocation("")
      setDescription("")
      setPhotos([])
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                </div>
                Belediyeye Bildir
              </DialogTitle>
              <DialogDescription>
                Erisilebilirlik sorunlarini bildirerek toplulugumuza katki saglayin. Bildiriminiz ilgili belediyeye iletilecektir.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Category Selection */}
              <div className="space-y-2">
                <Label htmlFor="category">Sorun Kategorisi</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Kategori secin" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <span className="flex items-center gap-2">
                          {typeof cat.icon === "string" ? (
                            <span>{cat.icon}</span>
                          ) : (
                            <cat.icon className="h-4 w-4" />
                          )}
                          {cat.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Konum</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Adres veya konum bilgisi"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setLocation("Mevcut Konum: Taksim, Istanbul")}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Mevcut Konumumu Kullan
                </Button>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Aciklama</Label>
                <Textarea
                  id="description"
                  placeholder="Sorunu detayli sekilde aciklayiniz..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>Fotograflar (Opsiyonel)</Label>
                <div className="flex flex-wrap gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative h-20 w-20 rounded-lg overflow-hidden border">
                      <img 
                        src={photo} 
                        alt={`Yuklenen fotograf ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        className="absolute right-1 top-1 rounded-full bg-background/80 p-0.5"
                        onClick={() => setPhotos(prev => prev.filter((_, i) => i !== index))}
                        aria-label="Fotografi kaldir"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 4 && (
                    <button
                      onClick={handlePhotoUpload}
                      className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-muted-foreground/25 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      <ImagePlus className="h-5 w-5" />
                      <span className="text-[10px]">Ekle</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  En fazla 4 fotograf yukleyebilirsiniz
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                Iptal
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleSubmit}
                disabled={!selectedCategory || !location || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Gonderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Bildir
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Bildiriminiz Alindi!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Bildiriminiz ilgili belediye birimine iletildi. Katkiniz icin tesekkur ederiz.
            </p>
            <p className="mt-4 text-sm font-medium text-primary">
              +25 Iyilik Puani Kazandiniz!
            </p>
            <Button className="mt-6 w-full" onClick={handleClose}>
              Tamam
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
