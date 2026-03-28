"use client"

import { cn } from "@/lib/utils"
import { 
  Menu, 
  User, 
  Heart,
  Settings,
  LogOut,
  HelpCircle,
  Award,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  onMenuToggle?: () => void
  showMenuButton?: boolean
  className?: string
}

export function Header({ onMenuToggle, showMenuButton = false, className }: HeaderProps) {
  return (
    <header 
      className={cn(
        "flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6",
        className
      )}
      role="banner"
    >
      {/* Left section */}
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={onMenuToggle}
            aria-label="Menüyü aç"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5" aria-label="Yol Arkadaşı Ana Sayfa">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">Y</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-foreground leading-tight">
              Yol Arkadaşı
            </h1>
            <p className="text-[10px] text-muted-foreground leading-none -mt-0.5">
              Erişilebilirlik Haritası
            </p>
          </div>
        </a>
      </div>

      {/* Center - Stats (desktop only) */}
      <div className="hidden lg:flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <span className="text-sm">♿</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Erişilebilir Mekan</p>
            <p className="font-semibold text-foreground">2,847</p>
          </div>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="flex items-center gap-2 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/30">
            <Heart className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Gönüllü Katkı</p>
            <p className="font-semibold text-foreground">12,459</p>
          </div>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="flex items-center gap-2 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-2/20">
            <Award className="h-4 w-4 text-chart-2" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">İyilik Puanı</p>
            <p className="font-semibold text-foreground">458</p>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Help */}
        <Button 
          variant="ghost" 
          size="icon"
          className="hidden sm:flex"
          aria-label="Yardım"
        >
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 px-2"
              aria-label="Kullanıcı menüsü"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  AY
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium leading-none">Ahmet Yılmaz</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                    İyilik Elçisi
                  </Badge>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>Ahmet Yılmaz</span>
                <span className="text-xs font-normal text-muted-foreground">ahmet@example.com</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profilim
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Award className="mr-2 h-4 w-4" />
              İyilik Puanlarım
              <Badge variant="secondary" className="ml-auto">458</Badge>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Heart className="mr-2 h-4 w-4" />
              Katkılarım
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Ayarlar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              Yardım
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
