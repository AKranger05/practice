"use client"

import { useStickerContext } from "@/lib/sticker-context"
import { ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

interface FloatingCartButtonProps {
  onClick: () => void
}

export function FloatingCartButton({ onClick }: FloatingCartButtonProps) {
  const { getTotalItems, getTotalPrice } = useStickerContext()
  const totalItems = getTotalItems()

  // Only show when there are items in cart
  if (totalItems === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[5] p-4 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "w-full max-w-lg mx-auto flex items-center justify-center gap-3 px-6 py-4 rounded-xl pointer-events-auto",
          "bg-eco-green text-white shadow-2xl",
          "hover:bg-eco-green/90 hover:scale-[1.02] transition-all duration-200"
        )}
        aria-label={`View cart with ${totalItems} items`}
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="font-semibold">View Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
      </button>
    </div>
  )
}
