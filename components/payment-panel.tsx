"use client"

import { useState } from "react"
import { useStickerContext } from "@/lib/sticker-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, ArrowLeft, CreditCard, Smartphone, Shield, AlertCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type PaymentMethod = "card" | "upi"

interface CardDetails {
  cardNumber: string
  cardName: string
  expiryDate: string
  cvv: string
}

interface UpiDetails {
  upiId: string
}

interface PaymentData {
  method: PaymentMethod
  cardDetails?: CardDetails
  upiDetails?: UpiDetails
}

interface ReceiverDetails {
  whatsappNumber: string
  email: string
  message: string
}

interface PaymentPanelProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  receiverDetails: ReceiverDetails
  onPaymentSuccess: () => void
}

export function PaymentPanel({
  isOpen,
  onClose,
  onBack,
  receiverDetails,
  onPaymentSuccess,
}: PaymentPanelProps) {
  const { cart, getTotalPrice, getTotalItems } = useStickerContext()
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // Card form state
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  // UPI form state
  const [upiDetails, setUpiDetails] = useState<UpiDetails>({
    upiId: "",
  })

  // Form validation errors
  const [errors, setErrors] = useState<{
    cardNumber?: string
    cardName?: string
    expiryDate?: string
    cvv?: string
    upiId?: string
  }>({})

  // Validate card number (16 digits, Luhn algorithm can be added)
  const validateCardNumber = (number: string): boolean => {
    const cleaned = number.replace(/\s/g, "")
    return /^\d{16}$/.test(cleaned)
  }

  // Validate expiry date (MM/YY format)
  const validateExpiryDate = (expiry: string): boolean => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false
    
    const [month, year] = expiry.split("/").map(Number)
    if (month < 1 || month > 12) return false
    
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1
    
    if (year < currentYear) return false
    if (year === currentYear && month < currentMonth) return false
    
    return true
  }

  // Validate CVV (3 or 4 digits)
  const validateCVV = (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv)
  }

  // Validate UPI ID
  const validateUpiId = (upiId: string): boolean => {
    return /^[\w.-]+@[\w.-]+$/.test(upiId)
  }

  // Handle card number input with formatting
  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    const limited = cleaned.slice(0, 16)
    const formatted = limited.replace(/(\d{4})/g, "$1 ").trim()
    
    setCardDetails({ ...cardDetails, cardNumber: formatted })
    if (errors.cardNumber) {
      setErrors({ ...errors, cardNumber: undefined })
    }
  }

  // Handle expiry date with formatting
  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    let formatted = cleaned
    
    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4)
    }
    
    setCardDetails({ ...cardDetails, expiryDate: formatted })
    if (errors.expiryDate) {
      setErrors({ ...errors, expiryDate: undefined })
    }
  }

  // Handle CVV input
  const handleCvvChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    const limited = cleaned.slice(0, 4)
    
    setCardDetails({ ...cardDetails, cvv: limited })
    if (errors.cvv) {
      setErrors({ ...errors, cvv: undefined })
    }
  }

  // Handle card name input
  const handleCardNameChange = (value: string) => {
    // Only allow letters and spaces
    const cleaned = value.replace(/[^a-zA-Z\s]/g, "").toUpperCase()
    setCardDetails({ ...cardDetails, cardName: cleaned })
    if (errors.cardName) {
      setErrors({ ...errors, cardName: undefined })
    }
  }

  // Handle UPI ID input
  const handleUpiIdChange = (value: string) => {
    setUpiDetails({ upiId: value.toLowerCase() })
    if (errors.upiId) {
      setErrors({ ...errors, upiId: undefined })
    }
  }

  // Validate and prepare payment data
  const validatePayment = (): PaymentData | null => {
    const newErrors: typeof errors = {}
    
    if (paymentMethod === "card") {
      if (!validateCardNumber(cardDetails.cardNumber)) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number"
      }
      if (!cardDetails.cardName || cardDetails.cardName.length < 3) {
        newErrors.cardName = "Please enter the name on card"
      }
      if (!validateExpiryDate(cardDetails.expiryDate)) {
        newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)"
      }
      if (!validateCVV(cardDetails.cvv)) {
        newErrors.cvv = "Please enter a valid CVV"
      }
    } else if (paymentMethod === "upi") {
      if (!validateUpiId(upiDetails.upiId)) {
        newErrors.upiId = "Please enter a valid UPI ID (e.g., username@upi)"
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return null
    }

    return {
      method: paymentMethod,
      cardDetails: paymentMethod === "card" ? cardDetails : undefined,
      upiDetails: paymentMethod === "upi" ? upiDetails : undefined,
    }
  }

  // Handle payment submission
  const handlePayment = async () => {
    setPaymentError(null)
    
    const paymentData = validatePayment()
    if (!paymentData) return

    setIsProcessing(true)

    try {
      // TODO: Backend team will replace this with actual API call
      // Example structure for backend integration:
      /*
      const response = await fetch("/api/payment/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: getTotalPrice(),
          items: cart.map(item => ({
            stickerId: item.sticker.id,
            quantity: item.quantity,
            price: item.sticker.price,
          })),
          receiverDetails: {
            whatsappNumber: receiverDetails.whatsappNumber,
            email: receiverDetails.email,
            message: receiverDetails.message,
          },
          paymentMethod: paymentData.method,
          paymentDetails: paymentData.method === "card" 
            ? {
                cardNumber: paymentData.cardDetails!.cardNumber.replace(/\s/g, ""),
                cardName: paymentData.cardDetails!.cardName,
                expiryDate: paymentData.cardDetails!.expiryDate,
                cvv: paymentData.cardDetails!.cvv,
              }
            : {
                upiId: paymentData.upiDetails!.upiId,
              }
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        onPaymentSuccess()
      } else {
        setPaymentError(result.message || "Payment failed. Please try again.")
      }
      */

      // MOCK: Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // Mock success
      console.log("Payment Data for Backend:", {
        amount: getTotalPrice(),
        items: cart,
        receiverDetails,
        paymentData,
      })
      
      onPaymentSuccess()
    } catch (error) {
      setPaymentError("Payment processing failed. Please try again.")
      console.error("Payment error:", error)
    } finally {
      setIsProcessing(false)
    }
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
              aria-label="Go back"
              disabled={isProcessing}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-charcoal">Payment</h2>
              <p className="text-xs text-muted-foreground">Choose your payment method</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
            aria-label="Close"
            disabled={isProcessing}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-charcoal">Select Payment Method</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              className="grid grid-cols-2 gap-3"
            >
              <div>
                <RadioGroupItem value="card" id="card" className="peer sr-only" />
                <Label
                  htmlFor="card"
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-card p-4 hover:bg-accent cursor-pointer peer-data-[state=checked]:border-plum-noir peer-data-[state=checked]:bg-plum-noir/5"
                >
                  <CreditCard className="w-8 h-8 mb-2 text-plum-noir" />
                  <span className="text-sm font-semibold">Card</span>
                  <span className="text-xs text-muted-foreground">Debit/Credit</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="upi" id="upi" className="peer sr-only" />
                <Label
                  htmlFor="upi"
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-card p-4 hover:bg-accent cursor-pointer peer-data-[state=checked]:border-plum-noir peer-data-[state=checked]:bg-plum-noir/5"
                >
                  <Smartphone className="w-8 h-8 mb-2 text-plum-noir" />
                  <span className="text-sm font-semibold">UPI</span>
                  <span className="text-xs text-muted-foreground">Google Pay, etc.</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Card Payment Form */}
          {paymentMethod === "card" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Card Number */}
              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="text-sm font-semibold text-charcoal">
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  className={errors.cardNumber ? "border-destructive" : ""}
                  maxLength={19}
                  disabled={isProcessing}
                />
                {errors.cardNumber && (
                  <p className="text-xs text-destructive">{errors.cardNumber}</p>
                )}
              </div>

              {/* Card Holder Name */}
              <div className="space-y-2">
                <Label htmlFor="cardName" className="text-sm font-semibold text-charcoal">
                  Cardholder Name
                </Label>
                <Input
                  id="cardName"
                  type="text"
                  placeholder="JOHN DOE"
                  value={cardDetails.cardName}
                  onChange={(e) => handleCardNameChange(e.target.value)}
                  className={errors.cardName ? "border-destructive" : ""}
                  disabled={isProcessing}
                />
                {errors.cardName && (
                  <p className="text-xs text-destructive">{errors.cardName}</p>
                )}
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry" className="text-sm font-semibold text-charcoal">
                    Expiry Date
                  </Label>
                  <Input
                    id="expiry"
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    className={errors.expiryDate ? "border-destructive" : ""}
                    maxLength={5}
                    disabled={isProcessing}
                  />
                  {errors.expiryDate && (
                    <p className="text-xs text-destructive">{errors.expiryDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv" className="text-sm font-semibold text-charcoal">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    type="password"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => handleCvvChange(e.target.value)}
                    className={errors.cvv ? "border-destructive" : ""}
                    maxLength={4}
                    disabled={isProcessing}
                  />
                  {errors.cvv && (
                    <p className="text-xs text-destructive">{errors.cvv}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* UPI Payment Form */}
          {paymentMethod === "upi" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <Label htmlFor="upiId" className="text-sm font-semibold text-charcoal">
                  UPI ID
                </Label>
                <Input
                  id="upiId"
                  type="text"
                  placeholder="yourname@paytm"
                  value={upiDetails.upiId}
                  onChange={(e) => handleUpiIdChange(e.target.value)}
                  className={errors.upiId ? "border-destructive" : ""}
                  disabled={isProcessing}
                />
                {errors.upiId && (
                  <p className="text-xs text-destructive">{errors.upiId}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Enter your UPI ID (e.g., username@paytm, username@googlepay)
                </p>
              </div>

              {/* TODO: Future mobile UPI flow */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  💡 <strong>Coming Soon:</strong> On mobile, you'll be redirected directly to your UPI app for payment
                </p>
              </div>
            </div>
          )}

          {/* Security Badge */}
          <div className="flex items-center gap-2 bg-eco-green/10 border border-eco-green/20 rounded-lg p-3">
            <Shield className="w-5 h-5 text-eco-green" />
            <p className="text-xs text-charcoal">
              Your payment information is encrypted and secure
            </p>
          </div>

          {/* Error Message */}
          {paymentError && (
            <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 rounded-lg p-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{paymentError}</p>
            </div>
          )}
        </div>

        {/* Footer - Order Summary & Pay Button */}
        <div className="border-t border-champagne-gold p-4 space-y-4">
          {/* Order Summary */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Items</span>
              <span className="font-semibold text-charcoal">{getTotalItems()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sending to</span>
              <div className="text-right">
                {receiverDetails.whatsappNumber && (
                  <p className="text-xs text-charcoal">+91 {receiverDetails.whatsappNumber}</p>
                )}
                {receiverDetails.email && (
                  <p className="text-xs text-charcoal">{receiverDetails.email}</p>
                )}
              </div>
            </div>
            <div className="border-t border-border pt-2 flex justify-between text-lg font-bold">
              <span className="text-charcoal">Total Amount</span>
              <span className="text-plum-noir">₹{getTotalPrice()}</span>
            </div>
          </div>

          {/* Pay Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-eco-green hover:bg-eco-green/90 text-white py-6 text-lg font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Payment...
              </span>
            ) : (
              `Pay ₹${getTotalPrice()}`
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By proceeding, you agree to our terms and conditions
          </p>
        </div>
      </div>
    </div>
  )
}
