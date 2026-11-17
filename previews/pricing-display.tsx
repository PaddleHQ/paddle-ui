"use client"

import * as React from "react"
import {
  PricingDisplay,
  type PricingDisplayPlan,
} from "@/registry/new-york/blocks/pricing-display/components/pricing-display"
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
