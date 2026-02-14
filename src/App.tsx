"use client"

import { useState } from "react"
import { StickerProvider, useStickerContext } from "@/lib/sticker-context"
import { ShopHeader } from "@/components/shop-header"
import { HeroSection } from "@/components/hero-section"
import { StickerWall } from "@/components/sticker-wall"
import { CartPanel } from "@/components/cart-panel"
import { ReceiverDetailsPanel } from "@/components/receiver-details-panel"
import { PaymentPanel } from "@/components/payment-panel"
import { HistoryPanel } from "@/components/history-panel"
import { MyStickersPanel } from "@/components/my-stickers-panel"
import { FloatingCartButton } from "@/components/floating-cart-button"
import { CheckCircle } from "lucide-react"

type View = "hero" | "wall"
type CheckoutStep = "cart" | "receiver-details" | "payment"

interface ReceiverDetails {
  senderName: string
  receiverName: string
  whatsappNumber: string
  email: string
  message: string
}

function StickerShopContent() {
  const [view, setView] = useState<View>("hero")
  const [shouldFocusSearch, setShouldFocusSearch] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isMyStickersOpen, setIsMyStickersOpen] = useState(false)
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false)
  const [receiverDetails, setReceiverDetails] = useState<ReceiverDetails | null>(null)
  
  const { checkout, addToHistory, cart } = useStickerContext()

  const handleCartCheckout = () => {
    // Move from cart to receiver details
    setCheckoutStep("receiver-details")
  }

  const handleReceiverDetailsSubmit = (details: ReceiverDetails) => {
    // Save receiver details and move to payment
    setReceiverDetails(details)
    setCheckoutStep("payment")
  }

  const handlePaymentSuccess = () => {
    // Add items to history with sender/receiver names
    if (receiverDetails) {
      for (const item of cart) {
        addToHistory({
          sticker: item.sticker,
          quantity: item.quantity,
          type: "sent",
          senderName: receiverDetails.senderName,
          receiverName: receiverDetails.receiverName,
        })
      }
    }
    
    // Complete checkout, clear cart, show success
    checkout()
    setCheckoutStep("cart")
    setIsCartOpen(false)
    setReceiverDetails(null)
    setShowCheckoutSuccess(true)
    setTimeout(() => setShowCheckoutSuccess(false), 3000)
  }

  const handleCloseCheckout = () => {
    setIsCartOpen(false)
    setCheckoutStep("cart")
    setReceiverDetails(null)
  }

  const handleBackToCart = () => {
    setCheckoutStep("cart")
  }

  const handleBackToReceiverDetails = () => {
    setCheckoutStep("receiver-details")
  }

  // Handle view all - with auto-focus option
  const handleViewAll = (autoFocusSearch = false) => {
    setView("wall")
    setShouldFocusSearch(autoFocusSearch)
  }

  // Handle back to hero
  const handleBackToHero = () => {
    setView("hero")
    setShouldFocusSearch(false)
  }

  return (
    <div className="min-h-screen pattern-bg">
      <ShopHeader
        onCartClick={() => setIsCartOpen(true)}
        onHistoryClick={() => setIsHistoryOpen(true)}
        onMyStickersClick={() => setIsMyStickersOpen(true)}
      />

      <main>
        {view === "hero" ? (
          <HeroSection onViewAll={handleViewAll} />
        ) : (
          <StickerWall 
            onBack={handleBackToHero} 
            shouldFocusSearch={shouldFocusSearch}
            onSearchFocused={() => setShouldFocusSearch(false)}
          />
        )}
      </main>

      {/* Floating Cart Button - only shows when items in cart */}
      <FloatingCartButton onClick={() => setIsCartOpen(true)} />

      {/* Cart Panel - Step 1 */}
      {checkoutStep === "cart" && (
        <CartPanel
          isOpen={isCartOpen}
          onClose={handleCloseCheckout}
          onCheckout={handleCartCheckout}
        />
      )}

      {/* Receiver Details Panel - Step 2 */}
      {checkoutStep === "receiver-details" && (
        <ReceiverDetailsPanel
          isOpen={isCartOpen}
          onClose={handleCloseCheckout}
          onBack={handleBackToCart}
          onProceedToPayment={handleReceiverDetailsSubmit}
        />
      )}

      {/* Payment Panel - Step 3 */}
      {checkoutStep === "payment" && receiverDetails && (
        <PaymentPanel
          isOpen={isCartOpen}
          onClose={handleCloseCheckout}
          onBack={handleBackToReceiverDetails}
          receiverDetails={receiverDetails}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* History Panel */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* My Stickers Panel */}
      <MyStickersPanel
        isOpen={isMyStickersOpen}
        onClose={() => setIsMyStickersOpen(false)}
      />

      {/* Checkout Success Toast */}
      {showCheckoutSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 bg-eco-green text-white px-6 py-4 rounded-xl shadow-2xl">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Order Placed Successfully!</p>
              <p className="text-sm opacity-90">Stickers will be sent to the receiver</p>
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
