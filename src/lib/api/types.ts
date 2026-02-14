import type { Sticker } from "../sticker-data"

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: "success" | "error"
}

export interface CartItem {
  id: string
  stickerId: string
  sticker: Sticker
  quantity: number
  addedAt: string
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

export interface HistoryItem {
  id: string
  userId: string
  stickerId: string
  sticker: Sticker
  quantity: number
  type: "sent" | "received"
  recipientId?: string
  senderId?: string
  createdAt: string
}

export interface HistoryFilters {
  type?: "sent" | "received" | "all"
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}

export interface CheckoutRequest {
  cartId: string
  recipientId: string
  message?: string
}

export interface CheckoutResponse {
  orderId: string
  status: "completed" | "pending" | "failed"
  items: CartItem[]
  total: number
  createdAt: string
}

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  createdAt: string
}
