"use client"

import { trendingStickers, categories } from "@/lib/sticker-data"
import { StickerItem } from "./sticker-item"
import { Button } from "@/components/ui/button"
import { Sparkles, Search } from "lucide-react"

interface HeroSectionProps {
  onViewAll: () => void
}

export function HeroSection({ onViewAll }: HeroSectionProps) {
  // Clicking search bar takes user directly to View All page where they can search
  const handleSearchClick = () => {
    onViewAll()
  }

  return (
    <section className="py-8 md:py-12 px-4 pb-32">
      <div className="max-w-5xl mx-auto">
        {/* Most Popular Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-persimmon text-white px-5 py-2.5 rounded-full font-semibold shadow-lg">
            <Sparkles className="w-5 h-5" />
            <span>Most Popular This Week</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <p className="text-muted-foreground text-center mb-6 md:mb-8">
          Select your favorite Indian sweet stickers - Premium quality at Rs.3 each!
        </p>

        {/* Search Bar - Clicking navigates to View All */}
        <div className="mb-8">
          <button
            type="button"
            onClick={handleSearchClick}
            className="relative w-full max-w-2xl mx-auto block"
          >
            <div className="flex items-center h-12 px-4 border border-input rounded-xl shadow-sm bg-background hover:bg-accent/50 transition-colors cursor-pointer">
              <Search className="w-5 h-5 text-muted-foreground mr-3" />
              <span className="text-muted-foreground text-base">Search all stickers or categories...</span>
            </div>
          </button>
        </div>
        
        {/* Main Layout: Category Cards + Sticker Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] gap-6 items-start mb-10">
          {/* Left Category Card - Syrup Based */}
          <div className="hidden lg:block bg-plum-noir rounded-2xl p-5 text-white shadow-xl">
            <h3 className="font-bold text-lg mb-1">Syrup Based Sweets</h3>
            <p className="text-sm text-white/80 mb-4">Traditional jalebis, gulab jamuns & more!</p>
            <p className="font-semibold text-champagne-gold">Rs.3 each</p>
          </div>

          {/* Center Sticker Grid - 2x3 layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8 justify-items-center">
            {trendingStickers.map((sticker) => (
              <StickerItem key={sticker.id} sticker={sticker} size="xl" />
            ))}
          </div>

          {/* Right Category Card - Milk Based */}
          <div className="hidden lg:block bg-persimmon rounded-2xl p-5 text-white shadow-xl">
            <h3 className="font-bold text-lg mb-1">Milk Based Delights</h3>
            <p className="text-sm text-white/80 mb-4">Creamy barfis, pedas & sweets!</p>
            <p className="font-semibold text-champagne-gold">Rs.3 each</p>
          </div>
        </div>

        {/* Mobile Category Cards */}
        <div className="flex gap-4 mb-8 lg:hidden overflow-x-auto pb-2">
          <div className="flex-shrink-0 bg-plum-noir rounded-xl p-4 text-white shadow-lg min-w-[160px]">
            <h3 className="font-bold text-sm mb-1">Syrup Based</h3>
            <p className="text-xs text-white/80">Rs.3 each</p>
          </div>
          <div className="flex-shrink-0 bg-persimmon rounded-xl p-4 text-white shadow-lg min-w-[160px]">
            <h3 className="font-bold text-sm mb-1">Milk Based</h3>
            <p className="text-xs text-white/80">Rs.3 each</p>
          </div>
          <div className="flex-shrink-0 bg-champagne-gold rounded-xl p-4 text-charcoal shadow-lg min-w-[160px]">
            <h3 className="font-bold text-sm mb-1">Laddoo Specials</h3>
            <p className="text-xs text-charcoal/80">Rs.3 each</p>
          </div>
        </div>

        {/* View All Button - z-index 0 so floating cart (z-5) appears above it */}
        <div className="flex justify-center relative z-0 mb-24">
          <Button
            onClick={onViewAll}
            className="bg-plum-noir hover:bg-plum-noir/90 text-white px-10 py-6 text-lg rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all"
          >
            View All Stickers
          </Button>
        </div>
      </div>
    </section>
  )
}
