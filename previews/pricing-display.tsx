"use client"

import * as React from "react"
import {
  PricingDisplay,
  type PricingDisplayPlan,
} from "@/registry/new-york/blocks/pricing-display/components/pricing-display"
import { BillingIntervalToggle } from "@/registry/new-york/blocks/billing-interval-toggle/components/billing-interval-toggle"
import { PricingTierCard } from "@/registry/new-york/blocks/pricing-cards/components/pricing-tier-card"
import { PricingTierCardGroup } from "@/registry/new-york/blocks/pricing-cards/components/pricing-tier-card-group"
import { Example, paddleEnv, RequiresPaddle } from "./shared"

const tiers = [
  { name: "Starter", features: ["1 project", "Email support"] },
  {
    name: "Pro",
    features: ["Unlimited projects", "Priority support", "SSO"],
    badge: "Most popular",
  },
  { name: "Business", features: ["Everything in Pro", "Audit logs"] },
]

export default function PricingDisplayPreview() {
  const [selected, setSelected] = React.useState<string>()

  const plans: PricingDisplayPlan[] = paddleEnv.priceIds.map((monthly, i) => {
    const annual = paddleEnv.annualPriceIds[i]
    return {
      ...(tiers[i] ?? { name: `Plan ${i + 1}` }),
      priceId: annual ? { month: monthly, year: annual } : monthly,
    }
  })

  return (
    <RequiresPaddle>
      <Example
        title="Pricing page"
        description="CTAs open Paddle overlay checkout. Set NEXT_PUBLIC_PREVIEW_ANNUAL_PRICE_IDS to show the interval toggle."
      >
        <PricingDisplay
          clientToken={paddleEnv.clientToken}
          environment={paddleEnv.environment}
          plans={plans}
          onCheckoutComplete={(data) => console.info("[preview] checkout complete", data)}
        />
      </Example>
      <Example
        title="Plan change selection"
        description="First plan is current; CTAs select instead of opening checkout."
      >
        <PricingDisplay
          clientToken={paddleEnv.clientToken}
          environment={paddleEnv.environment}
          plans={plans}
          currentPriceIds={paddleEnv.priceIds.slice(0, 1)}
          selectedPriceId={selected}
          onPlanSelect={setSelected}
        />
      </Example>
    </RequiresPaddle>
  )
}

const thumbnailPrices = ["$12.00", "$29.00", "$99.00"]

/** Static stand-in: the real block fetches localized prices from Paddle. */
export function Thumbnail() {
  const [interval, setInterval] = React.useState("month")
  return (
    <div className="flex flex-col items-center gap-6">
      <BillingIntervalToggle
        intervals={["month", "year"]}
        value={interval}
        onValueChange={setInterval}
      />
      <PricingTierCardGroup className="w-full">
        {tiers.map((tier, i) => (
          <PricingTierCard
            key={tier.name}
            {...tier}
            priceData={{ total: thumbnailPrices[i], interval: "month" }}
            ctaLabel="Get started"
            onSelect={() => {}}
          />
        ))}
      </PricingTierCardGroup>
    </div>
  )
}
