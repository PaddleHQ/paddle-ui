"use client"

import * as React from "react"
import { PricingTierCard } from "@/registry/new-york/blocks/pricing-cards/components/pricing-tier-card"
import { PricingTierCardGroup } from "@/registry/new-york/blocks/pricing-cards/components/pricing-tier-card-group"
import { Example } from "./shared"

const tiers = [
  {
    name: "Starter",
    description: "For individuals getting started.",
    priceData: { total: "$12.00", interval: "month" },
    features: ["1 project", "Email support", "Basic analytics"],
  },
  {
    name: "Pro",
    description: "For growing teams.",
    priceData: {
      total: "$29.00",
      originalTotal: "$39.00",
      interval: "month",
      trialPeriod: "14 days",
    },
    features: ["Unlimited projects", "Priority support", "Advanced analytics", "SSO"],
    badge: "Most popular",
  },
  {
    name: "Business",
    description: "For organisations at scale.",
    priceData: { total: "$99.00", interval: "month" },
    features: ["Everything in Pro", "Audit logs", "Dedicated success manager"],
  },
]

export default function PricingCardsPreview() {
  const [selected, setSelected] = React.useState("Pro")

  return (
    <>
      <Example title="Three tiers" description="Click a CTA to change the selected card.">
        <PricingTierCardGroup>
          {tiers.map((tier) => (
            <PricingTierCard
              key={tier.name}
              {...tier}
              ctaLabel="Choose plan"
              isSelected={selected === tier.name}
              onSelect={() => setSelected(tier.name)}
            />
          ))}
        </PricingTierCardGroup>
      </Example>
      <Example title="Plan change flow" description="Current plan highlighted.">
        <PricingTierCardGroup>
          {tiers.map((tier) => (
            <PricingTierCard
              key={tier.name}
              {...tier}
              isCurrent={tier.name === "Starter"}
              ctaLabel="Switch"
              onSelect={() => {}}
            />
          ))}
        </PricingTierCardGroup>
      </Example>
      <Example title="Loading">
        <PricingTierCardGroup>
          {tiers.map((tier) => (
            <PricingTierCard key={tier.name} name={tier.name} loading />
          ))}
        </PricingTierCardGroup>
      </Example>
    </>
  )
}
