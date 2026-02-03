"use client"

import { useState } from "react"
import { StickerProvider, useStickerContext } from "@/lib/sticker-context"
import { ShopHeader } from "@/components/shop-header"
import { HeroSection } from "@/components/hero-section"
import { StickerWall } from "@/components/sticker-wall"
import { CartPanel } from "@/components/cart-panel"
import { HistoryPanel } from "@/components/history-panel"
import { FloatingCartButton } from "@/components/floating-cart-button"
import { CheckCircle } from "lucide-react"

type View = "hero" | "wall"

function StickerShopContent() {
  const [view, setView] = useState<View>("hero")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false)
  
  const { checkout } = useStickerContext()

  const handleCheckout = () => {
    checkout()
    setIsCartOpen(false)
    setShowCheckoutSuccess(true)
    setTimeout(() => setShowCheckoutSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen pattern-bg">
      <ShopHeader
        onCartClick={() => setIsCartOpen(true)}
        onHistoryClick={() => setIsHistoryOpen(true)}
      />

      <main>
        {view === "hero" ? (
          <HeroSection onViewAll={() => setView("wall")} />
        ) : (
          <StickerWall onBack={() => setView("hero")} />
        )}
      </main>

      {/* Floating Cart Button - only shows when items in cart */}
      <FloatingCartButton onClick={() => setIsCartOpen(true)} />

      {/* Cart Panel */}
      <CartPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      {/* History Panel */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* Checkout Success Toast */}
      {showCheckoutSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 bg-eco-green text-white px-6 py-4 rounded-xl shadow-2xl">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Order Placed Successfully!</p>
              <p className="text-sm opacity-90">Check your history for details</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function StickerShopPage() {
  return (
    <StickerProvider>
      <StickerShopContent />
    </StickerProvider>
  )
}
