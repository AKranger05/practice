"use client"

import { useStickerContext } from "@/lib/sticker-context"
import type { Sticker } from "@/lib/sticker-data"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface StickerItemProps {
  sticker: Sticker
  size?: "sm" | "md" | "lg" | "xl"
  showQuantityBadge?: boolean
}

export function StickerItem({ sticker, size = "md", showQuantityBadge = false }: StickerItemProps) {
  const { cart, addToCart, updateQuantity } = useStickerContext()
  
  const cartItem = cart.find((item) => item.sticker.id === sticker.id)
  const isSelected = !!cartItem
  const quantity = cartItem?.quantity || 0

  // Much bigger sizes for visual impact
  const sizeClasses = {
    sm: "w-16 h-16 text-2xl",
    md: "w-24 h-24 md:w-28 md:h-28 text-4xl md:text-5xl",
    lg: "w-28 h-28 md:w-36 md:h-36 text-5xl md:text-6xl",
    xl: "w-32 h-32 md:w-40 md:h-40 text-6xl md:text-7xl",
  }

  const handleClick = () => {
    if (!isSelected) {
      addToCart(sticker)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 relative">
      {/* Quantity badge for wall view */}
      {showQuantityBadge && isSelected && (
        <div className="absolute -top-1 -right-1 z-10 bg-eco-green text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
          {quantity}
        </div>
      )}
      
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "relative rounded-full flex items-center justify-center transition-all duration-200 bg-card hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden",
          sizeClasses[size],
          isSelected
            ? "ring-[5px] ring-champagne-gold ring-offset-[3px] ring-offset-background"
            : "ring-2 ring-border/50"
        )}
        aria-label={`Select ${sticker.name} sticker`}
      >
        {sticker.image ? (
          <Image
            src={sticker.image || "/placeholder.svg"}
            alt={sticker.name}
            fill
            className="object-cover"
          />
        ) : (
          <span className="select-none">{sticker.emoji}</span>
        )}
      </button>
      
      {isSelected && !showQuantityBadge && (
        <div className="flex items-center gap-2 bg-card rounded-full shadow-lg px-3 py-1.5 border-2 border-champagne-gold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button
            type="button"
            onClick={() => updateQuantity(sticker.id, quantity - 1)}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-charcoal"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-semibold text-charcoal">{quantity}</span>
          <button
            type="button"
            onClick={() => updateQuantity(sticker.id, quantity + 1)}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-charcoal"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quantity controls for wall view with badge */}
      {isSelected && showQuantityBadge && (
        <div className="flex items-center gap-1 bg-card rounded-full shadow-md px-2 py-1 border border-champagne-gold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button
            type="button"
            onClick={() => updateQuantity(sticker.id, quantity - 1)}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-charcoal"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-5 text-center font-semibold text-sm text-charcoal">{quantity}</span>
          <button
            type="button"
            onClick={() => updateQuantity(sticker.id, quantity + 1)}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-charcoal"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
}
