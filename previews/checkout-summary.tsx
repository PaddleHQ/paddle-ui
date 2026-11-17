"use client"

import { CheckoutSummary } from "@/registry/new-york/blocks/checkout-summary/components/checkout-summary"
import type { CheckoutSummaryData } from "@/registry/new-york/blocks/paddle-helpers/lib/paddle-types"
import { Example } from "./shared"

const subscription: CheckoutSummaryData = {
  currency: "USD",
  items: [{ name: "Pro", priceName: "Monthly", quantity: 1, lineTotal: 29 }],
  subtotal: 29,
  tax: 5.8,
  total: 34.8,
  recurringTotal: 34.8,
  recurringInterval: "month",
  recurringFrequency: 1,
}

const multiItemWithDiscount: CheckoutSummaryData = {
  currency: "EUR",
  items: [
    { name: "Business", priceName: "Annual", quantity: 1, lineTotal: 490 },
    { name: "Extra seats", priceName: "Per seat", quantity: 5, lineTotal: 250 },
  ],
  subtotal: 740,
  discount: 74,
  tax: 133.2,
  total: 799.2,
  recurringTotal: 799.2,
  recurringInterval: "year",
  recurringFrequency: 1,
}

const trial: CheckoutSummaryData = {
  currency: "GBP",
  items: [{ name: "Starter", priceName: "Monthly", quantity: 1, lineTotal: 0 }],
  subtotal: 0,
  tax: 0,
  total: 0,
  recurringTotal: 12,
  recurringInterval: "month",
  recurringFrequency: 1,
  trialPeriod: "14 days",
}

export default function CheckoutSummaryPreview() {
  return (
    <>
      <Example title="Single subscription item">
        <CheckoutSummary
          summary={subscription}
          policyUrl="https://www.paddle.com/legal/refund-policy"
        />
      </Example>
      <Example title="Multiple items with discount">
        <CheckoutSummary summary={multiItemWithDiscount} />
      </Example>
      <Example title="Free trial">
        <CheckoutSummary summary={trial} />
      </Example>
      <Example title="Loading" description="summary is undefined">
        <CheckoutSummary />
      </Example>
    </>
  )
}
