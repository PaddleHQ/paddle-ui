"use client"

import { PlanChangePreview } from "@/registry/new-york/blocks/plan-change-preview/components/plan-change-preview"
import type { PlanChangePreviewData } from "@/registry/new-york/blocks/paddle-helpers/lib/paddle-types"
import { daysFromNow, Example } from "./shared"

const upgrade: PlanChangePreviewData = {
  currency: "USD",
  currentPlan: { productName: "Starter", price: 12, interval: "month" },
  newPlan: { productName: "Pro", price: 29, interval: "month" },
  costImpact: {
    resultDirection: "charge",
    resultAmount: 8.77,
    credit: 6.19,
    charge: 14.96,
    immediateAmount: 10.52,
    newRecurringTotal: 34.8,
    newBillingInterval: "month",
  },
  subscriptionStatus: "active",
  collectionMode: "automatic",
}

const downgrade: PlanChangePreviewData = {
  currency: "USD",
  currentPlan: { productName: "Business", price: 99, interval: "month" },
  newPlan: { productName: "Pro", price: 29, interval: "month" },
  costImpact: {
    resultDirection: "credit",
    resultAmount: 36.13,
    credit: 51.1,
    charge: 14.97,
    nextBillAmount: 0,
    nextBillDate: daysFromNow(16),
    newRecurringTotal: 34.8,
    newBillingInterval: "month",
  },
  discount: { description: "20% off", endsAt: daysFromNow(90) },
}

const annualSwitch: PlanChangePreviewData = {
  currency: "EUR",
  currentPlan: { productName: "Pro", price: 29, interval: "month" },
  newPlan: { productName: "Pro", price: 290, interval: "year" },
  costImpact: {
    resultDirection: "none",
    resultAmount: 0,
    nextBillAmount: 348,
    nextBillDate: daysFromNow(16),
    newRecurringTotal: 348,
    newBillingInterval: "year",
  },
  scheduledChange: { action: "cancel", effectiveAt: daysFromNow(16) },
  collectionMode: "manual",
}

export default function PlanChangePreviewPreview() {
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <Example title="Upgrade, prorated immediately">
        <PlanChangePreview preview={upgrade} prorationBillingMode="prorated_immediately" />
      </Example>
      <Example title="Downgrade with discount, next billing period">
        <PlanChangePreview
          preview={downgrade}
          prorationBillingMode="prorated_next_billing_period"
        />
      </Example>
      <Example
        title="Monthly to annual, do not bill"
        description="Manual collection with a pending cancellation."
      >
        <PlanChangePreview preview={annualSwitch} prorationBillingMode="do_not_bill" />
      </Example>
      <Example title="Trial upgrade">
        <PlanChangePreview
          preview={{
            ...upgrade,
            subscriptionStatus: "trialing",
            costImpact: {
              ...upgrade.costImpact,
              resultDirection: "none",
              resultAmount: 0,
              immediateAmount: undefined,
            },
          }}
          prorationBillingMode="prorated_immediately"
        />
      </Example>
      <Example title="Loading">
        <PlanChangePreview />
      </Example>
    </div>
  )
}

export function Thumbnail() {
  return (
    <div className="mx-auto max-w-lg">
      <PlanChangePreview preview={upgrade} prorationBillingMode="prorated_immediately" />
    </div>
  )
}
