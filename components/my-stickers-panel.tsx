"use client"

import { useStickerContext } from "@/lib/sticker-context"
import { Button } from "@/components/ui/button"
import { X, Package, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { useMemo } from "react"

interface MyStickersPanelProps {
  isOpen: boolean
  onClose: () => void
}

interface StickerStats {
  stickerId: string
  name: string
  emoji: string
  sent: number
  received: number
  total: number
}

export function MyStickersPanel({ isOpen, onClose }: MyStickersPanelProps) {
  const { history } = useStickerContext()

  // Calculate sticker statistics
  const stickerStats = useMemo(() => {
    const statsMap = new Map<string, StickerStats>()

    history.forEach((item) => {
      const existing = statsMap.get(item.sticker.id)
      
      if (existing) {
        if (item.type === "sent") {
          existing.sent += item.quantity
        } else {
          existing.received += item.quantity
        }
        existing.total = existing.sent + existing.received
      } else {
        statsMap.set(item.sticker.id, {
          stickerId: item.sticker.id,
          name: item.sticker.name,
          emoji: item.sticker.emoji,
          sent: item.type === "sent" ? item.quantity : 0,
          received: item.type === "received" ? item.quantity : 0,
          total: item.quantity,
        })
      }
    })

    return Array.from(statsMap.values()).sort((a, b) => b.total - a.total)
  }, [history])

  const totalStickers = stickerStats.reduce((sum, stat) => sum + stat.total, 0)
  const totalSent = stickerStats.reduce((sum, stat) => sum + stat.sent, 0)
  const totalReceived = stickerStats.reduce((sum, stat) => sum + stat.received, 0)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-champagne-gold">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-plum-noir" />
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

        {/* Total Summary */}
        <div className="p-4 bg-plum-noir/5 border-b border-champagne-gold">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-charcoal">Total Collection</span>
              <span className="text-2xl font-bold text-plum-noir">{totalStickers}</span>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1 text-persimmon">
                <ArrowUpRight className="w-4 h-4" />
                <span>Sent: {totalSent}</span>
              </div>
              <div className="flex items-center gap-1 text-eco-green">
                <ArrowDownLeft className="w-4 h-4" />
                <span>Received: {totalReceived}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticker List */}
        <div className="flex-1 overflow-y-auto p-4">
          {stickerStats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Package className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-center">No stickers yet</p>
              <p className="text-sm text-center">Start buying or receiving stickers!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stickerStats.map((stat) => (
                <div
                  key={stat.stickerId}
                  className="bg-muted/50 rounded-xl p-4 border border-border"
                >
                  <div className="flex items-start gap-3">
                    {/* Sticker Emoji */}
                    <div className="w-12 h-12 flex items-center justify-center bg-card rounded-full text-2xl shadow-sm flex-shrink-0">
                      {stat.emoji}
                    </div>

                    {/* Sticker Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-charcoal mb-2">{stat.name}</h3>
                      
                      <div className="space-y-1 text-sm">
                        {/* Sent */}
                        {stat.sent > 0 && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-persimmon">
                              <ArrowUpRight className="w-3 h-3" />
                              <span>Sent</span>
                            </div>
                            <span className="font-semibold text-persimmon">{stat.sent}</span>
                          </div>
                        )}

                        {/* Received */}
                        {stat.received > 0 && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-eco-green">
                              <ArrowDownLeft className="w-3 h-3" />
                              <span>Received</span>
                            </div>
                            <span className="font-semibold text-eco-green">{stat.received}</span>
                          </div>
                        )}

                        {/* Total */}
                        <div className="flex items-center justify-between pt-1 border-t border-border">
                          <span className="font-medium text-charcoal">Total</span>
                          <span className="font-bold text-plum-noir">{stat.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
