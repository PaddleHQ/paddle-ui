import { describe, expect, it } from "vitest"
import { mapSubscriptionToStatusData } from "@/registry/new-york/blocks/subscription-status-card/lib/subscription-status-card-utils"

type Subscription = Parameters<typeof mapSubscriptionToStatusData>[0]
type Discount = NonNullable<Parameters<typeof mapSubscriptionToStatusData>[2]>

const subscription: Subscription = {
  id: "sub_01",
  status: "active",
  currencyCode: "USD",
  billingCycle: { interval: "month", frequency: 1 },
  startedAt: "2025-01-01T00:00:00Z",
  discount: { id: "dsc_01", endsAt: null },
  items: [{ product: { name: "Pro" }, quantity: 1 }],
}

const recurringTransactionDetails = {
  totals: { total: "4250", discount: "750" },
  lineItems: [{ totals: { subtotal: "5000", total: "4250" } }],
}

const percentageDiscount: Discount = {
  id: "dsc_01",
  description: "Black Friday",
  code: "BF15",
  type: "percentage",
  amount: "15",
}

describe("mapSubscriptionToStatusData discount", () => {
  it("labels a percentage discount with its percentage, not the seller's description", () => {
    const data = mapSubscriptionToStatusData(
      subscription,
      recurringTransactionDetails,
      percentageDiscount
    )

    expect(data.discount?.description).toBe("-15%")
  })

  it("leaves flat discounts for the component to format from the savings amount", () => {
    const data = mapSubscriptionToStatusData(subscription, recurringTransactionDetails, {
      ...percentageDiscount,
      type: "flat",
      amount: "750",
    })

    expect(data.discount?.description).toBeUndefined()
    expect(data.discount?.savingsAmount).toBe(7.5)
  })
})
