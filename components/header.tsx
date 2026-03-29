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
  ChevronDown,
  Accessibility
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
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface HeaderProps {
  onMenuToggle?: () => void
  showMenuButton?: boolean
  className?: string
}

// Current contribution stats
const contributionStats = {
  current: 458,
  nextMilestone: 500,
  reward: "Tekerlekli Sandalye Bagisi",
  rewardIcon: "♿",
}

export function Header({ onMenuToggle, showMenuButton = false, className }: HeaderProps) {
  const progressPercent = (contributionStats.current / contributionStats.nextMilestone) * 100
  const remaining = contributionStats.nextMilestone - contributionStats.current

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
            aria-label="Menuyu ac"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5" aria-label="Yol Arkadasi Ana Sayfa">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Accessibility className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-foreground leading-tight">
              Yol Arkadasi
            </h1>
            <p className="text-[10px] text-muted-foreground leading-none -mt-0.5">
              Erisilebilirlik Haritasi
            </p>
          </div>
        </a>
      </div>

      {/* Center - Stats with Progress (desktop only) */}
      <div className="hidden lg:flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <span className="text-sm">♿</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Erisilebilir Mekan</p>
            <p className="font-semibold text-foreground">2,847</p>
          </div>
        </div>
        <div className="h-8 w-px bg-border" />
        
        {/* Contribution Progress */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/30">
                  <Heart className="h-4 w-4 text-accent-foreground" />
                </div>
                <div className="w-40">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-muted-foreground">Gonullu Katki</p>
                    <p className="text-xs font-medium text-foreground">{contributionStats.current}/{contributionStats.nextMilestone}</p>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                  <p className="text-[10px] text-muted-foreground mt-0.5 group-hover:text-primary transition-colors">
                    {remaining} katki daha = {contributionStats.reward}
                  </p>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <div className="text-center">
                <p className="font-medium">{contributionStats.reward}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {remaining} katki daha yaparak bir ihtiyac sahibine tekerlekli sandalye bagislayabilirsiniz!
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-2xl">{contributionStats.rewardIcon}</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="h-8 w-px bg-border" />
        <div className="flex items-center gap-2 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-2/20">
            <Award className="h-4 w-4 text-chart-2" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Iyilik Puani</p>
            <p className="font-semibold text-foreground">{contributionStats.current}</p>
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
          aria-label="Yardim"
        >
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 px-2"
              aria-label="Kullanici menusu"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  AY
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium leading-none">Ahmet Yilmaz</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                    Iyilik Elcisi
                  </Badge>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>Ahmet Yilmaz</span>
                <span className="text-xs font-normal text-muted-foreground">ahmet@example.com</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Progress in dropdown */}
            <div className="px-2 py-2">
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{contributionStats.rewardIcon}</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium">{contributionStats.reward}</p>
                    <p className="text-[10px] text-muted-foreground">{remaining} katki kaldi</p>
                  </div>
                </div>
                <Progress value={progressPercent} className="h-1.5" />
              </div>
            </div>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profilim
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Award className="mr-2 h-4 w-4" />
              Iyilik Puanlarim
              <Badge variant="secondary" className="ml-auto">{contributionStats.current}</Badge>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Heart className="mr-2 h-4 w-4" />
              Katkilarim
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Ayarlar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              Yardim
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Cikis Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
