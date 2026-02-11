"use client"

import { useStickerContext } from "@/lib/sticker-context"
import { Button } from "@/components/ui/button"
import { X, Sparkles, ArrowUpRight, ArrowDownLeft } from "lucide-react"

interface MyStickersPanel {
  isOpen: boolean
  onClose: () => void
}

export function MyStickersPanel({ isOpen, onClose }: MyStickersPanel) {
  const { history } = useStickerContext()

  if (!isOpen) return null

  // Calculate totals
  const sentStickers = history.filter((item) => item.type === "sent")
  const receivedStickers = history.filter((item) => item.type === "received")
  const totalStickers = sentStickers.length + receivedStickers.length

  // Group stickers by sticker ID and aggregate data
  const aggregatedStickers = history.reduce((acc, item) => {
    const key = item.sticker.id
    if (!acc[key]) {
      acc[key] = {
        sticker: item.sticker,
        sent: [],
        received: [],
      }
    }
    if (item.type === "sent") {
      acc[key].sent.push(item)
    } else {
      acc[key].received.push(item)
    }
    return acc
  }, {} as Record<string, { sticker: any; sent: any[]; received: any[] }>)

  const stickerList = Object.values(aggregatedStickers)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-champagne-gold">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-plum-noir" />
            <h2 className="text-xl font-bold text-charcoal">My Stickers</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
            aria-label="Close my stickers"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Total Count */}
        <div className="p-4 bg-gradient-to-r from-plum-noir to-persimmon text-white">
          <div className="text-center">
            <p className="text-sm opacity-90">Total Stickers</p>
            <p className="text-4xl font-bold mt-1">{totalStickers}</p>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4" />
                <span>{sentStickers.length} Sent</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4" />
                <span>{receivedStickers.length} Received</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stickers List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {stickerList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Sparkles className="w-16 h-16 mb-4 opacity-30" />
              <p>No stickers yet</p>
              <p className="text-sm">Start sending and receiving stickers!</p>
            </div>
          ) : (
            stickerList.map(({ sticker, sent, received }) => (
              <div
                key={sticker.id}
                className="bg-muted/50 rounded-xl p-4 space-y-3"
              >
                {/* Sticker Header */}
                <div className="flex items-center gap-3 border-b border-border pb-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-card rounded-full text-2xl shadow-sm">
                    {sticker.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-charcoal">{sticker.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {sent.length + received.length} total
                    </p>
                  </div>
                </div>

                {/* Sent Details */}
                {sent.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-persimmon">
                      <ArrowUpRight className="w-3 h-3" />
                      <span>Sent ({sent.length})</span>
                    </div>
                    {sent.map((item) => (
                      <div
                        key={item.id}
                        className="pl-5 text-sm text-muted-foreground"
                      >
                        <p>
                          To: <span className="font-medium text-charcoal">{item.receiverName || "Unknown"}</span>
                        </p>
                        <p className="text-xs">{formatDate(item.date)} • {item.quantity}x</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Received Details */}
                {received.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-eco-green">
                      <ArrowDownLeft className="w-3 h-3" />
                      <span>Received ({received.length})</span>
                    </div>
                    {received.map((item) => (
                      <div
                        key={item.id}
                        className="pl-5 text-sm text-muted-foreground"
                      >
                        <p>
                          From: <span className="font-medium text-charcoal">{item.senderName || "Unknown"}</span>
                        </p>
                        <p className="text-xs">{formatDate(item.date)} • {item.quantity}x</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
