"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, Home } from "lucide-react"

interface SuccessPanelProps {
  onBackToHome: () => void
}

export function SuccessPanel({ onBackToHome }: SuccessPanelProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-green/10 via-background to-champagne-gold/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card rounded-2xl shadow-2xl p-8 text-center space-y-6 border border-border">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-eco-green/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-eco-green" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-charcoal">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Your stickers are on their way! 🎉
            </p>
          </div>

          {/* Details */}
          <div className="bg-muted/50 rounded-xl p-4 text-left space-y-2 text-sm">
            <p className="text-charcoal">
              <span className="font-semibold">What's next?</span>
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Stickers will be delivered via WhatsApp/Email</li>
              <li>Check your transaction history for details</li>
              <li>Recipient can start using them right away!</li>
            </ul>
          </div>

          {/* Action Button */}
          <Button
            onClick={onBackToHome}
            className="w-full bg-plum-noir hover:bg-plum-noir/90 h-12"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* Extra Info */}
          <p className="text-xs text-muted-foreground">
            Thank you for using Mithai Stickers! 🥨
          </p>
        </div>
      </div>
    </div>
  )
}
