import type { Sticker } from "../sticker-data"
import type {
  ApiResponse,
  Cart,
  CartItem,
  HistoryItem,
  HistoryFilters,
  CheckoutRequest,
  CheckoutResponse,
} from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        data: null,
        error: errorData.message || `HTTP error ${response.status}`,
        status: "error",
      }
    }

    const data = await response.json()
    return { data, error: null, status: "success" }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Network error",
      status: "error",
    }
  }
}

export const stickerService = {
  async getStickers(): Promise<ApiResponse<Sticker[]>> {
    return fetchApi<Sticker[]>("/stickers")
  },

  async getTrendingStickers(): Promise<ApiResponse<Sticker[]>> {
    return fetchApi<Sticker[]>("/stickers/trending")
  },

  async getStickersByCategory(category: string): Promise<ApiResponse<Sticker[]>> {
    return fetchApi<Sticker[]>(`/stickers?category=${encodeURIComponent(category)}`)
  },
}

export const cartService = {
  async getCart(): Promise<ApiResponse<Cart>> {
    return fetchApi<Cart>("/cart")
  },

  async addToCart(stickerId: string, quantity: number = 1): Promise<ApiResponse<CartItem>> {
    return fetchApi<CartItem>("/cart/items", {
      method: "POST",
      body: JSON.stringify({ stickerId, quantity }),
    })
  },

  async updateQuantity(itemId: string, quantity: number): Promise<ApiResponse<CartItem>> {
    return fetchApi<CartItem>(`/cart/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    })
  },

  async removeFromCart(itemId: string): Promise<ApiResponse<void>> {
    return fetchApi<void>(`/cart/items/${itemId}`, {
      method: "DELETE",
    })
  },

  async clearCart(): Promise<ApiResponse<void>> {
    return fetchApi<void>("/cart", {
      method: "DELETE",
    })
  },

  async checkout(request: CheckoutRequest): Promise<ApiResponse<CheckoutResponse>> {
    return fetchApi<CheckoutResponse>("/cart/checkout", {
      method: "POST",
      body: JSON.stringify(request),
    })
  },
}

export const historyService = {
  async getHistory(filters?: HistoryFilters): Promise<ApiResponse<HistoryItem[]>> {
    const params = new URLSearchParams()
    if (filters?.type && filters.type !== "all") params.append("type", filters.type)
    if (filters?.startDate) params.append("startDate", filters.startDate)
    if (filters?.endDate) params.append("endDate", filters.endDate)
    if (filters?.limit) params.append("limit", filters.limit.toString())
    if (filters?.offset) params.append("offset", filters.offset.toString())

    const queryString = params.toString()
    return fetchApi<HistoryItem[]>(`/history${queryString ? `?${queryString}` : ""}`)
  },

  async getHistoryItem(id: string): Promise<ApiResponse<HistoryItem>> {
    return fetchApi<HistoryItem>(`/history/${id}`)
  },
}
