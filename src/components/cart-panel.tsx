"use client"

import { useStickerContext } from "@/lib/sticker-context"
import { Button } from "@/components/ui/button"
import { Minus, Plus, X, ShoppingCart } from "lucide-react"

interface CartPanelProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
}

export function CartPanel({ isOpen, onClose, onCheckout }: CartPanelProps) {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useStickerContext()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-champagne-gold">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-plum-noir" />
            <h2 className="text-xl font-bold text-charcoal">Your Cart</h2>
            <span className="bg-plum-noir text-white text-xs px-2 py-0.5 rounded-full">
              {getTotalItems()}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingCart className="w-16 h-16 mb-4 opacity-30" />
              <p>Your cart is empty</p>
              <p className="text-sm">Select some stickers to get started!</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.sticker.id}
                className="flex items-center gap-4 p-3 bg-muted rounded-xl"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-card rounded-full text-2xl shadow-sm">
                  {item.sticker.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-charcoal truncate">{item.sticker.name}</p>
                  <p className="text-sm text-muted-foreground">₹{item.sticker.price} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.sticker.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-card hover:bg-champagne-gold/50 transition-colors shadow-sm"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.sticker.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-card hover:bg-champagne-gold/50 transition-colors shadow-sm"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.sticker.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-destructive/10 text-destructive transition-colors"
                  aria-label="Remove item"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Order Summary */}
        {cart.length > 0 && (
          <div className="border-t border-champagne-gold p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-charcoal">Order Summary</h3>
              <div className="text-sm space-y-1 max-h-24 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.sticker.id} className="flex justify-between text-muted-foreground">
                    <span>{item.sticker.name} x {item.quantity}</span>
                    <span>₹{item.sticker.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-plum-noir">₹{getTotalPrice()}</span>
              </div>
            </div>

            <Button
              onClick={onCheckout}
              className="w-full bg-eco-green hover:bg-eco-green/90 text-white py-6 text-lg font-semibold rounded-xl shadow-lg"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
