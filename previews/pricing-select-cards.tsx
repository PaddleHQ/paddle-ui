"use client"

import * as React from "react"
import { Sparkles, Zap } from "lucide-react"
import {
  PricingSelectCardGrid,
  PricingSelectCardGroup,
  PricingSelectCardStacked,
} from "@/registry/new-york/blocks/pricing-select-cards/components/pricing-select-card"
import { Example } from "./shared"

const plans = [
  {
    priceId: "pri_monthly",
    name: "Monthly",
    description: "Billed every month",
    priceData: { total: "$12.00", interval: "month" },
    icon: <Zap className="size-4" />,
  },
  {
    priceId: "pri_annual",
    name: "Annual",
    description: "Two months free",
    priceData: {
      total: "$120.00",
      originalTotal: "$144.00",
      interval: "year",
      trialPeriod: "7 days",
    },
    badge: "Save 17%",
    icon: <Sparkles className="size-4" />,
  },
]

export default function PricingSelectCardsPreview() {
  const [stacked, setStacked] = React.useState("pri_annual")
  const [grid, setGrid] = React.useState("pri_monthly")

  return (
    <>
      <Example title="Stacked">
        <div className="max-w-md">
          <PricingSelectCardGroup value={stacked} onValueChange={setStacked}>
            {plans.map((plan) => (
              <PricingSelectCardStacked key={plan.priceId} {...plan} />
            ))}
          </PricingSelectCardGroup>
        </div>
      </Example>
      <Example title="Grid" description="Monthly marked as the current plan.">
        <PricingSelectCardGroup value={grid} onValueChange={setGrid} layout="grid">
          {plans.map((plan) => (
            <PricingSelectCardGrid
              key={plan.priceId}
              priceId={plan.priceId}
              name={plan.name}
              description={plan.description}
              priceData={plan.priceData}
              badge={plan.badge}
              isCurrent={plan.priceId === "pri_monthly"}
            />
          ))}
        </PricingSelectCardGroup>
      </Example>
      <Example title="Loading">
        <div className="max-w-md">
          <PricingSelectCardGroup value="" onValueChange={() => {}}>
            {plans.map((plan) => (
              <PricingSelectCardStacked
                key={plan.priceId}
                priceId={plan.priceId}
                name={plan.name}
                loading
              />
            ))}
          </PricingSelectCardGroup>
        </div>
      </Example>
    </>
  )
}
