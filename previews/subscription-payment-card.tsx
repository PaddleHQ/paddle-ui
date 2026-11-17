"use client"

import { SubscriptionPaymentCard } from "@/registry/new-york/blocks/subscription-payment-card/components/subscription-payment-card"
import { daysFromNow, Example } from "./shared"

const portalUrl = "https://customer-portal.paddle.com/"

export default function SubscriptionPaymentCardPreview() {
  return (
    <div className="grid gap-12 md:grid-cols-2">
      <Example title="Card">
        <SubscriptionPaymentCard
          nextPayment={{ amount: 34.8, currency: "USD", date: daysFromNow(18) }}
          paymentMethod={{
            type: "card",
            cardBrand: "visa",
            last4: "4242",
            expiryMonth: 8,
            expiryYear: 2029,
          }}
          updatePaymentMethodUrl={portalUrl}
        />
      </Example>
      <Example title="PayPal">
        <SubscriptionPaymentCard
          nextPayment={{ amount: 120, currency: "EUR", date: daysFromNow(200) }}
          paymentMethod={{ type: "paypal" }}
          updatePaymentMethodUrl={portalUrl}
        />
      </Example>
      <Example title="Apple Pay, no next payment" description="e.g. paused subscription">
        <SubscriptionPaymentCard paymentMethod={{ type: "apple_pay" }} />
      </Example>
      <Example title="Loading">
        <SubscriptionPaymentCard />
      </Example>
    </div>
  )
}
