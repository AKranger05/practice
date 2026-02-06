"use client"

import { useState, useRef } from "react"
import { stickers, categories } from "@/lib/sticker-data"
import { StickerItem } from "./sticker-item"
import { SearchBar } from "./search-bar"
import { ChevronLeft, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StickerWallProps {
  onBack: () => void
}

// Category color schemes
const categoryColors: Record<string, { bg: string; text: string; btnBg: string; btnHover: string }> = {
  "syrup-based": { 
    bg: "bg-plum-noir", 
    text: "text-white",
    btnBg: "bg-plum-noir",
    btnHover: "hover:bg-plum-noir/90"
  },
  "milk-based": { 
    bg: "bg-persimmon", 
    text: "text-white",
    btnBg: "bg-persimmon",
    btnHover: "hover:bg-persimmon/90"
  },
  "laddoo-specials": { 
    bg: "bg-champagne-gold", 
    text: "text-charcoal",
    btnBg: "bg-champagne-gold",
    btnHover: "hover:bg-champagne-gold/90"
  },
  "festive-favorites": { 
    bg: "bg-plum-noir", 
    text: "text-white",
    btnBg: "bg-plum-noir",
    btnHover: "hover:bg-plum-noir/90"
  },
}

export function StickerWall({ onBack }: StickerWallProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  
  // Refs for scrolling to categories
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Filter stickers based on search query
  const filteredStickers = stickers.filter((sticker) => {
    const query = searchQuery.toLowerCase()
    const matchesName = sticker.name.toLowerCase().includes(query)
    const categoryName = categories.find((c) => c.id === sticker.category)?.name.toLowerCase() || ""
    const matchesCategory = categoryName.includes(query)
    return matchesName || matchesCategory
  })

  // Group filtered stickers by category
  const groupedStickers = categories.map((category) => ({
    category,
    stickers: filteredStickers.filter((s) => s.category === category.id),
  })).filter((group) => group.stickers.length > 0)

  // Smooth scroll to category
  const scrollToCategory = (categoryId: string) => {
    const element = categoryRefs.current[categoryId]
    if (element) {
      const offset = 140 // Account for sticky header height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
      setActiveCategory(categoryId)
    }
  }

  return (
    <section className="py-6 px-4 pb-28">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-plum-noir hover:text-plum-noir/80 transition-colors font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Trending</span>
          </button>
          
          <div className="flex items-center gap-2 text-charcoal font-semibold">
            <Tag className="w-5 h-5" />
            <span>All Stickers</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar onSearch={setSearchQuery} placeholder="Search all stickers or categories..." />
        </div>

        {/* Category Quick Jump Buttons - Sticky */}
        <div className="sticky top-[72px] z-20 bg-off-white/95 backdrop-blur-sm -mx-4 px-4 py-4 mb-6 shadow-sm">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => {
              const colors = categoryColors[category.id] || categoryColors["syrup-based"]
              const isActive = activeCategory === category.id
              
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => scrollToCategory(category.id)}
                  className={cn(
                    "flex-shrink-0 px-4 py-2 rounded-full font-semibold text-sm transition-all shadow-sm",
                    colors.btnBg,
                    colors.text,
                    colors.btnHover,
                    isActive && "ring-2 ring-offset-2 ring-plum-noir scale-105"
                  )}
                >
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Results or No Results */}
        {groupedStickers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-2">
              No stickers found matching "{searchQuery}"
            </p>
            <p className="text-sm text-muted-foreground">
              Try searching for different keywords or browse all categories
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {groupedStickers.map(({ category, stickers: categoryStickers }) => {
              const colors = categoryColors[category.id] || categoryColors["syrup-based"]
              
              return (
                <div 
                  key={category.id}
                  ref={(el) => {
                    categoryRefs.current[category.id] = el
                  }}
                >
                  {/* Category Header Bar */}
                  <div className={cn("rounded-xl px-5 py-3 mb-6 shadow-md", colors.bg)}>
                    <h3 className={cn("font-bold text-lg", colors.text)}>
                      {category.name}
                    </h3>
                    <p className={cn("text-sm opacity-80", colors.text)}>
                      {categoryStickers.length} sticker{categoryStickers.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                  
                  {/* Sticker Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
                    {categoryStickers.map((sticker) => (
                      <div key={sticker.id} className="flex flex-col items-center gap-2">
                        <StickerItem sticker={sticker} size="lg" showQuantityBadge />
                        <span className="text-sm text-charcoal font-medium text-center">
                          {sticker.name}
                        </span>
                        <span className="text-sm text-muted-foreground font-semibold">
                          Rs.{sticker.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Custom scrollbar hide for horizontal scroll */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}
