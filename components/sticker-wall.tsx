"use client"

import { stickers, categories } from "@/lib/sticker-data"
import { StickerItem } from "./sticker-item"
import { ChevronLeft, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StickerWallProps {
  onBack: () => void
}

// Category color schemes
const categoryColors: Record<string, { bg: string; text: string }> = {
  "syrup-based": { bg: "bg-plum-noir", text: "text-white" },
  "milk-based": { bg: "bg-persimmon", text: "text-white" },
  "laddoo-specials": { bg: "bg-champagne-gold", text: "text-charcoal" },
  "festive-favorites": { bg: "bg-plum-noir", text: "text-white" },
}

export function StickerWall({ onBack }: StickerWallProps) {
  return (
    <section className="py-6 px-4 pb-28">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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

        <div className="space-y-10">
          {categories.map((category) => {
            const categoryStickers = stickers.filter((s) => s.category === category.id)
            const colors = categoryColors[category.id] || categoryColors["syrup-based"]
            
            return (
              <div key={category.id}>
                {/* Category Header Bar */}
                <div className={cn("rounded-xl px-5 py-3 mb-6 shadow-md", colors.bg)}>
                  <h3 className={cn("font-bold text-lg", colors.text)}>
                    {category.name}
                  </h3>
                  <p className={cn("text-sm opacity-80", colors.text)}>
                    Premium quality stickers
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
      </div>
    </section>
  )
}
