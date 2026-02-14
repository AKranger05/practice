"use client"

import { Button } from "@/components/ui/button"
import { History, Package } from "lucide-react"

interface HeaderProps {
  onHistoryClick: () => void
  onMyStickersClick: () => void
}

export function Header({ onHistoryClick, onMyStickersClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-plum-noir shadow-lg">
      <div className="container mx-auto px-4 py-6">
        {/* Title - Center Aligned */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
            MMD Stickers
          </h1>
          <p className="text-champagne-gold text-sm md:text-base">
            Sweet moments, shared digitally
          </p>
        </div>

        {/* Action Buttons - Center Aligned */}
        <div className="flex items-center justify-center gap-2">
          {/* My Stickers Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onMyStickersClick}
            className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30"
          >
            <Package className="w-4 h-4" />
            <span>My Stickers</span>
          </Button>

          {/* History Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onHistoryClick}
            className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30"
          >
            <History className="w-4 h-4" />
            <span>History</span>
          </Button>

          {/* Mobile Icons Only */}
          <Button
            variant="outline"
            size="icon"
            onClick={onMyStickersClick}
            className="sm:hidden bg-white/10 hover:bg-white/20 text-white border-white/30"
            aria-label="My Stickers"
          >
            <Package className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onHistoryClick}
            className="sm:hidden bg-white/10 hover:bg-white/20 text-white border-white/30"
            aria-label="History"
          >
            <History className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
