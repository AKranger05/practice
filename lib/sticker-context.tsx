"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Sticker } from "./sticker-data"

// For backend integration, import these:
// import { cartService, historyService } from "./api/sticker-service"

export interface CartItem {
  sticker: Sticker
  quantity: number
}

export interface HistoryItem {
  id: string
  sticker: Sticker
  quantity: number
  type: "sent" | "received"
  date: Date
}

interface StickerContextType {
  cart: CartItem[]
  history: HistoryItem[]
  isLoading: boolean
  error: string | null
  addToCart: (sticker: Sticker) => void
  removeFromCart: (stickerId: string) => void
  updateQuantity: (stickerId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  checkout: () => Promise<void>
  addToHistory: (item: Omit<HistoryItem, "id" | "date">) => void
  refreshHistory: () => Promise<void>
  clearError: () => void
}

const StickerContext = createContext<StickerContextType | undefined>(undefined)

const MOCK_HISTORY: HistoryItem[] = [
  {
    id: "hist-1",
    sticker: { id: "jalebi", name: "Jalebi", price: 25, category: "syrup-based", emoji: "🥨" },
    quantity: 2,
    type: "sent",
    date: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: "hist-2",
    sticker: { id: "kaju-katli", name: "Kaju Katli", price: 45, category: "festive-favorites", emoji: "💎" },
    quantity: 1,
    type: "received",
    date: new Date(Date.now() - 86400000),
  },
  {
    id: "hist-3",
    sticker: { id: "rasmalai", name: "Rasmalai", price: 35, category: "milk-based", emoji: "🥛" },
    quantity: 3,
    type: "sent",
    date: new Date(Date.now() - 86400000 * 5),
  },
]

export function StickerProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [history, setHistory] = useState<HistoryItem[]>(MOCK_HISTORY)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => setError(null), [])

  // Replace with: const res = await cartService.addToCart(sticker.id, 1)
  const addToCart = useCallback((sticker: Sticker) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.sticker.id === sticker.id)
      if (existing) {
        return prev.map((item) =>
          item.sticker.id === sticker.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { sticker, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((stickerId: string) => {
    setCart((prev) => prev.filter((item) => item.sticker.id !== stickerId))
  }, [])

  const updateQuantity = useCallback((stickerId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.sticker.id !== stickerId))
      return
    }
    setCart((prev) =>
      prev.map((item) => (item.sticker.id === stickerId ? { ...item, quantity } : item))
    )
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const getTotalItems = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  const getTotalPrice = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.sticker.price * item.quantity, 0)
  }, [cart])

  const addToHistory = useCallback((item: Omit<HistoryItem, "id" | "date">) => {
    setHistory((prev) => [
      {
        ...item,
        id: `hist-${Date.now()}`,
        date: new Date(),
      },
      ...prev,
    ])
  }, [])

  // Replace with: const res = await historyService.getHistory()
  const refreshHistory = useCallback(async () => {
    // setHistory(res.data)
    setHistory([...MOCK_HISTORY])
  }, [])

  // Replace with: const res = await cartService.checkout({ cartId, recipientId })
  const checkout = useCallback(async () => {
    for (const item of cart) {
      addToHistory({
        sticker: item.sticker,
        quantity: item.quantity,
        type: "sent",
      })
    }
    clearCart()
  }, [cart, addToHistory, clearCart])

  return (
    <StickerContext.Provider
      value={{
        cart,
        history,
        isLoading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        checkout,
        addToHistory,
        refreshHistory,
        clearError,
      }}
    >
      {children}
    </StickerContext.Provider>
  )
}

export function useStickerContext() {
  const context = useContext(StickerContext)
  if (!context) {
    throw new Error("useStickerContext must be used within a StickerProvider")
  }
  return context
}
