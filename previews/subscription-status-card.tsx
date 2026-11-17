"use client"

import { SubscriptionStatusCard } from "@/registry/new-york/blocks/subscription-status-card/components/subscription-status-card"
import type { SubscriptionStatusData } from "@/registry/new-york/blocks/paddle-helpers/lib/paddle-types"
import { daysFromNow, Example } from "./shared"

const base: SubscriptionStatusData = {
  id: "sub_01preview",
  items: [{ productName: "Pro", priceName: "Monthly", quantity: 1, lineTotal: 29 }],
  totalAmount: 34.8,
  currency: "USD",
  interval: "month",
  status: "active",
  startedAt: daysFromNow(-120),
  nextBilledAt: daysFromNow(18),
  collectionMode: "automatic",
}

const cases: { title: string; data: SubscriptionStatusData }[] = [
  { title: "Active", data: base },
  {
    title: "Active, multiple items with discount",
    data: {
      ...base,
      items: [
        { productName: "Business", priceName: "Annual", quantity: 1, lineTotal: 490 },
        {
          productName: "Extra seats",
          productDescription: "Additional team members",
          priceName: "Per seat",
          quantity: 5,
          unitPrice: 50,
          lineTotal: 250,
        },
      ],
      totalAmount: 799.2,
      currency: "EUR",
      interval: "year",
      nextBilledAt: daysFromNow(240),
      discount: {
        savingsAmount: 74,
        code: "SAVE10",
        description: "-10%",
        endsAt: daysFromNow(365),
      },
    },
  },
  { title: "Trialing", data: { ...base, status: "trialing", nextBilledAt: daysFromNow(5) } },
  { title: "Past due", data: { ...base, status: "past_due" } },
  {
    title: "Past due, manual collection",
    data: { ...base, status: "past_due", collectionMode: "manual" },
  },
  {
    title: "Scheduled cancellation",
    data: { ...base, scheduledChange: { action: "cancel", effectiveAt: daysFromNow(18) } },
  },
  {
    title: "Paused",
    data: {
      ...base,
      status: "paused",
      nextBilledAt: undefined,
      scheduledChange: { action: "resume", effectiveAt: daysFromNow(30) },
    },
  },
  {
    title: "Canceled",
    data: { ...base, status: "canceled", nextBilledAt: undefined, canceledAt: daysFromNow(-2) },
  },
  {
    title: "Quarterly, invoiced",
    data: {
      ...base,
      items: [{ productName: "Pro", priceName: "Quarterly", quantity: 1, lineTotal: 72.5 }],
      billingFrequency: 3,
      collectionMode: "manual",
      totalAmount: 87,
    },
  },
]

const noop = () => {}

export default function SubscriptionStatusCardPreview() {
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      {cases.map(({ title, data }) => (
        <Example key={title} title={title}>
          <SubscriptionStatusCard
            subscription={data}
            onChangePlan={noop}
            onUpdatePaymentMethod={noop}
            onManageSubscription={noop}
          />
        </Example>
      ))}
      <Example title="Badge inline, no actions">
        <SubscriptionStatusCard subscription={base} statusBadgePosition="inline" />
      </Example>
      <Example title="Loading">
        <SubscriptionStatusCard />
      </Example>
    </div>
  )
}

export function Thumbnail() {
  return (
    <div className="mx-auto max-w-md">
      <SubscriptionStatusCard
        subscription={base}
        onChangePlan={noop}
        onUpdatePaymentMethod={noop}
        onManageSubscription={noop}
      />
    </div>
  )
}
