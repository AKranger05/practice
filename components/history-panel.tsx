"use client"

import { useStickerContext } from "@/lib/sticker-context"
import { Button } from "@/components/ui/button"
import { X, History, ArrowUpRight, ArrowDownLeft } from "lucide-react"

interface HistoryPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const { history } = useStickerContext()

  if (!isOpen) return null

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const sentHistory = history.filter((item) => item.type === "sent")
  const receivedHistory = history.filter((item) => item.type === "received")

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-champagne-gold">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-plum-noir" />
            <h2 className="text-xl font-bold text-charcoal">Sticker History</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
            aria-label="Close history"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* History Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Sent Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ArrowUpRight className="w-4 h-4 text-persimmon" />
              <h3 className="font-semibold text-charcoal">Sent Stickers</h3>
              <span className="bg-persimmon/10 text-persimmon text-xs px-2 py-0.5 rounded-full">
                {sentHistory.length}
              </span>
            </div>
            {sentHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No stickers sent yet</p>
            ) : (
              <div className="space-y-2">
                {sentHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-persimmon/5 rounded-xl border border-persimmon/20"
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-card rounded-full text-xl shadow-sm">
                      {item.sticker.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-charcoal text-sm">{item.sticker.name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(item.date)}</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-persimmon text-white text-xs px-2 py-0.5 rounded-full">
                        x{item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Received Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ArrowDownLeft className="w-4 h-4 text-eco-green" />
              <h3 className="font-semibold text-charcoal">Received Stickers</h3>
              <span className="bg-eco-green/10 text-eco-green text-xs px-2 py-0.5 rounded-full">
                {receivedHistory.length}
              </span>
            </div>
            {receivedHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No stickers received yet</p>
            ) : (
              <div className="space-y-2">
                {receivedHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-eco-green/5 rounded-xl border border-eco-green/20"
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-card rounded-full text-xl shadow-sm">
                      {item.sticker.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-charcoal text-sm">{item.sticker.name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(item.date)}</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-eco-green text-white text-xs px-2 py-0.5 rounded-full">
                        x{item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
