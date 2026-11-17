"use client"

import * as React from "react"
import { SubscriptionAlert } from "@/registry/new-york/blocks/subscription-alert/components/subscription-alert"
import type { SubscriptionAlertData } from "@/registry/new-york/blocks/paddle-helpers/lib/paddle-types"
import { daysFromNow, Example } from "./shared"

const portalUrl = "https://customer-portal.paddle.com/"

const cases: { title: string; data: SubscriptionAlertData }[] = [
  {
    title: "Past due",
    data: { status: "past_due", updatePaymentMethodUrl: portalUrl },
  },
  { title: "Canceled", data: { status: "canceled", canceledAt: daysFromNow(-3) } },
  {
    title: "Scheduled cancellation",
    data: { status: "active", scheduledChange: { action: "cancel", effectiveAt: daysFromNow(12) } },
  },
  {
    title: "Scheduled pause",
    data: {
      status: "active",
      scheduledChange: { action: "pause", effectiveAt: daysFromNow(5), resumeAt: daysFromNow(35) },
    },
  },
  {
    title: "Paused, resuming",
    data: { status: "paused", scheduledChange: { action: "resume", effectiveAt: daysFromNow(20) } },
  },
  { title: "Paused indefinitely", data: { status: "paused" } },
  { title: "Trialing", data: { status: "trialing", trialEndsAt: daysFromNow(5) } },
]

export default function SubscriptionAlertPreview() {
  const [dismissed, setDismissed] = React.useState(false)

  return (
    <>
      {cases.map(({ title, data }) => (
        <Example key={title} title={title}>
          <SubscriptionAlert subscription={data} />
        </Example>
      ))}
      <Example title="Dismissible">
        {dismissed ? (
          <button className="text-sm underline" onClick={() => setDismissed(false)}>
            Reset
          </button>
        ) : (
          <SubscriptionAlert subscription={cases[0].data} onDismiss={() => setDismissed(true)} />
        )}
      </Example>
      <Example title="Active, nothing to say" description="Renders nothing.">
        <SubscriptionAlert subscription={{ status: "active" }} />
      </Example>
    </>
  )
}
