"use client"

import { useState } from "react"
import { useStickerContext } from "@/lib/sticker-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, ArrowLeft, MessageSquare, Mail, Phone } from "lucide-react"
import { Label } from "@/components/ui/label"

interface ReceiverDetailsFormData {
  whatsappNumber: string
  email: string
  message: string
}

interface ReceiverDetailsPanelProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  onProceedToPayment: (details: ReceiverDetailsFormData) => void
}

export function ReceiverDetailsPanel({
  isOpen,
  onClose,
  onBack,
  onProceedToPayment,
}: ReceiverDetailsPanelProps) {
  const { getTotalPrice, getTotalItems } = useStickerContext()
  
  const [formData, setFormData] = useState<ReceiverDetailsFormData>({
    whatsappNumber: "",
    email: "",
    message: "",
  })

  const [errors, setErrors] = useState<Partial<ReceiverDetailsFormData>>({})

  // Validate phone number (Indian format: 10 digits)
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phone)
  }

  // Validate email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Handle form submission
  const handleSubmit = () => {
    const newErrors: Partial<ReceiverDetailsFormData> = {}

    // At least one contact method required
    if (!formData.whatsappNumber && !formData.email) {
      newErrors.whatsappNumber = "Please provide at least WhatsApp or Email"
      newErrors.email = "Please provide at least WhatsApp or Email"
      setErrors(newErrors)
      return
    }

    // Validate WhatsApp if provided
    if (formData.whatsappNumber && !validatePhone(formData.whatsappNumber)) {
      newErrors.whatsappNumber = "Please enter a valid 10-digit mobile number"
    }

    // Validate Email if provided
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // If there are errors, don't proceed
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Clear errors and proceed
    setErrors({})
    onProceedToPayment(formData)
  }

  const handlePhoneChange = (value: string) => {
    // Only allow digits
    const cleaned = value.replace(/\D/g, "")
    // Limit to 10 digits
    const limited = cleaned.slice(0, 10)
    setFormData({ ...formData, whatsappNumber: limited })
    
    // Clear error when user starts typing
    if (errors.whatsappNumber) {
      setErrors({ ...errors, whatsappNumber: undefined })
    }
  }

  const handleEmailChange = (value: string) => {
    setFormData({ ...formData, email: value })
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors({ ...errors, email: undefined })
    }
  }

  const handleMessageChange = (value: string) => {
    // Limit to 200 characters
    const limited = value.slice(0, 200)
    setFormData({ ...formData, message: limited })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-champagne-gold">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              aria-label="Go back to cart"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-charcoal">Receiver Details</h2>
              <p className="text-xs text-muted-foreground">Where should we send the stickers?</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Info Card */}
          <div className="bg-persimmon/10 border border-persimmon/20 rounded-xl p-4">
            <p className="text-sm text-charcoal">
              💡 <strong>Tip:</strong> You can send to WhatsApp, Email, or both!
            </p>
          </div>

          {/* WhatsApp Number Field */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="flex items-center gap-2 text-sm font-semibold text-charcoal">
              <Phone className="w-4 h-4 text-eco-green" />
              WhatsApp Number
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                +91
              </span>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="9876543210"
                value={formData.whatsappNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`pl-12 ${errors.whatsappNumber ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                aria-invalid={!!errors.whatsappNumber}
              />
            </div>
            {errors.whatsappNumber && (
              <p className="text-xs text-destructive">{errors.whatsappNumber}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Stickers will be sent via WhatsApp to this number
            </p>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-charcoal">
              <Mail className="w-4 h-4 text-persimmon" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="receiver@example.com"
              value={formData.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={errors.email ? "border-destructive focus-visible:ring-destructive/20" : ""}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Stickers will be sent to this email address
            </p>
          </div>

          {/* Message Field (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center gap-2 text-sm font-semibold text-charcoal">
              <MessageSquare className="w-4 h-4 text-plum-noir" />
              Personal Message <span className="text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Add a sweet message for the receiver... 🎉"
              value={formData.message}
              onChange={(e) => handleMessageChange(e.target.value)}
              className="resize-none h-24"
              maxLength={200}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>This message will be sent along with the stickers</span>
              <span>{formData.message.length}/200</span>
            </div>
          </div>
        </div>

        {/* Order Summary & Action */}
        <div className="border-t border-champagne-gold p-4 space-y-4">
          {/* Summary */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Items</span>
              <span className="font-semibold text-charcoal">{getTotalItems()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span className="text-charcoal">Total Amount</span>
              <span className="text-plum-noir">₹{getTotalPrice()}</span>
            </div>
          </div>

          {/* Proceed Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-eco-green hover:bg-eco-green/90 text-white py-6 text-lg font-semibold rounded-xl shadow-lg"
          >
            Proceed to Payment
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            You'll be redirected to secure payment gateway
          </p>
        </div>
      </div>
    </div>
  )
}
