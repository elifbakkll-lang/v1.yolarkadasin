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
  CheckCircle2,
  HandHeart,
  Building2,
  ThumbsUp,
  MessageSquare
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import type { UserType } from "./header"

interface ReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userType: UserType
}

const reportCategories = [
  { id: "elevator", label: "Asansor Arizasi", icon: "elevator" },
  { id: "ramp", label: "Rampa Sorunu", icon: "ramp" },
  { id: "sidewalk", label: "Kaldirim Engeli", icon: Construction },
  { id: "parking", label: "Engelli Park Ihlali", icon: ParkingCircle },
  { id: "toilet", label: "Engelli Tuvaleti", icon: "toilet" },
  { id: "other", label: "Diger", icon: AlertTriangle },
]

// Simulated pending reports for disabled users to view
const pendingReports = [
  {
    id: "r1",
    category: "Asansor Arizasi",
    location: "Taksim Metro Istasyonu",
    reportedBy: "Mehmet K.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: "in_progress",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  },
  {
    id: "r2",
    category: "Rampa Sorunu",
    location: "Kadikoy Iskele",
    reportedBy: "Ayse T.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    status: "resolved",
    image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&h=300&fit=crop",
  },
  {
    id: "r3",
    category: "Kaldirim Engeli",
    location: "Besiktas Carsisi",
    reportedBy: "Ali R.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    status: "pending",
    image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&h=300&fit=crop",
  },
]

const statusConfig = {
  pending: { label: "Beklemede", color: "bg-amber-500", textColor: "text-amber-500" },
  in_progress: { label: "Isleniyor", color: "bg-blue-500", textColor: "text-blue-500" },
  resolved: { label: "Cozuldu", color: "bg-primary", textColor: "text-primary" },
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Az once"
  if (diffMins < 60) return `${diffMins} dk once`
  if (diffHours < 24) return `${diffHours} saat once`
  return `${diffDays} gun once`
}

export function ReportModal({ open, onOpenChange, userType }: ReportModalProps) {
  const [step, setStep] = useState<"form" | "success">("form")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [photos, setPhotos] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState(userType === "volunteer" ? "report" : "view")
  const [feedbackSent, setFeedbackSent] = useState<string[]>([])

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
      setActiveTab(userType === "volunteer" ? "report" : "view")
    }, 300)
  }

  const handleSendFeedback = (reportId: string) => {
    setFeedbackSent(prev => [...prev, reportId])
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  {userType === "volunteer" ? (
                    <HandHeart className="h-5 w-5 text-primary" />
                  ) : (
                    <Building2 className="h-5 w-5 text-primary" />
                  )}
                </div>
                {userType === "volunteer" ? "Gonullu Bildirimi" : "Erisilebilirlik Merkezi"}
              </DialogTitle>
              <DialogDescription>
                {userType === "volunteer" 
                  ? "Erisilebilirlik sorunlarini fotografla belgeleyerek topluluga katki saglayin."
                  : "Bildirilen sorunlari takip edin ve belediyeye iletim yapin."
                }
              </DialogDescription>
            </DialogHeader>

            {/* Tabs for different views */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                {userType === "volunteer" ? (
                  <>
                    <TabsTrigger value="report" className="text-xs">
                      <Camera className="mr-1 h-3 w-3" />
                      Sorun Bildir
                    </TabsTrigger>
                    <TabsTrigger value="myreports" className="text-xs">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Bildirimlerim
                    </TabsTrigger>
                  </>
                ) : (
                  <>
                    <TabsTrigger value="view" className="text-xs">
                      <MessageSquare className="mr-1 h-3 w-3" />
                      Gonullu Raporlari
                    </TabsTrigger>
                    <TabsTrigger value="report" className="text-xs">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Belediyeye Bildir
                    </TabsTrigger>
                  </>
                )}
              </TabsList>

              {/* Report Form - Available to both users */}
              <TabsContent value="report" className="space-y-4 py-4">
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
                              <Accessibility className="h-4 w-4" />
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

                {/* Photo Upload - Emphasized for volunteers */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Fotograflar 
                    {userType === "volunteer" && (
                      <span className="text-xs text-primary font-normal">(+10 puan her fotograf)</span>
                    )}
                  </Label>
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

                {/* Actions */}
                <div className="flex gap-2 pt-2">
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
                        {userType === "volunteer" ? "Raporla" : "Belediyeye Bildir"}
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* View volunteer reports - For disabled users */}
              <TabsContent value="view" className="py-4">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Iyilik elcilerinin bildirdigi sorunlari buradan takip edebilirsiniz.
                  </p>
                  {pendingReports.map((report) => {
                    const status = statusConfig[report.status as keyof typeof statusConfig]
                    const hasSentFeedback = feedbackSent.includes(report.id)
                    
                    return (
                      <div 
                        key={report.id}
                        className="rounded-lg border p-3 space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">{report.category}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" />
                              {report.location}
                            </p>
                          </div>
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full text-white",
                            status.color
                          )}>
                            {status.label}
                          </span>
                        </div>
                        
                        {report.image && (
                          <img 
                            src={report.image} 
                            alt={report.category}
                            className="w-full h-32 object-cover rounded-md"
                          />
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <HandHeart className="h-3 w-3" />
                            {report.reportedBy}
                          </span>
                          <span>{formatTimeAgo(report.timestamp)}</span>
                        </div>

                        <div className="flex gap-2 pt-1">
                          {report.status === "resolved" ? (
                            <Button
                              size="sm"
                              variant={hasSentFeedback ? "secondary" : "default"}
                              className="flex-1 h-8 text-xs"
                              onClick={() => handleSendFeedback(report.id)}
                              disabled={hasSentFeedback}
                            >
                              <ThumbsUp className="mr-1 h-3 w-3" />
                              {hasSentFeedback ? "Tesekkur Edildi" : "Tesekkur Et"}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 h-8 text-xs"
                              onClick={() => {
                                setActiveTab("report")
                                setSelectedCategory(report.category === "Asansor Arizasi" ? "elevator" : "other")
                                setLocation(report.location)
                              }}
                            >
                              <Building2 className="mr-1 h-3 w-3" />
                              Belediyeye Ilet
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              {/* My reports - For volunteers */}
              <TabsContent value="myreports" className="py-4">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Gonderdiginiz raporlarin durumunu takip edin.
                  </p>
                  {pendingReports.slice(0, 2).map((report) => {
                    const status = statusConfig[report.status as keyof typeof statusConfig]
                    
                    return (
                      <div 
                        key={report.id}
                        className="rounded-lg border p-3 space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">{report.category}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" />
                              {report.location}
                            </p>
                          </div>
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full text-white",
                            status.color
                          )}>
                            {status.label}
                          </span>
                        </div>
                        
                        {report.image && (
                          <img 
                            src={report.image} 
                            alt={report.category}
                            className="w-full h-24 object-cover rounded-md"
                          />
                        )}
                        
                        <div className="text-xs text-muted-foreground">
                          {formatTimeAgo(report.timestamp)}
                        </div>

                        {report.status === "resolved" && (
                          <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 rounded-md px-2 py-1.5">
                            <CheckCircle2 className="h-3 w-3" />
                            Engelli bireyler tarafindan cozuldu olarak onaylandi!
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {userType === "volunteer" ? "Raporunuz Alindi!" : "Bildiriminiz Alindi!"}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {userType === "volunteer" 
                ? "Katkiniz engelli bireylerin guvenli seyahati icin degerlidir."
                : "Bildiriminiz ilgili belediye birimine iletildi."
              }
            </p>
            <p className="mt-4 text-sm font-medium text-primary">
              +{userType === "volunteer" ? (25 + photos.length * 10) : 25} Iyilik Puani Kazandiniz!
            </p>
            {userType === "volunteer" && photos.length > 0 && (
              <p className="text-xs text-muted-foreground">
                ({photos.length} fotograf icin +{photos.length * 10} bonus puan)
              </p>
            )}
            <Button className="mt-6 w-full" onClick={handleClose}>
              Tamam
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
