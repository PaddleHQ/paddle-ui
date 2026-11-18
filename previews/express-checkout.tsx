"use client"

import * as React from "react"
import { ExpressCheckout } from "@/registry/new-york/blocks/express-checkout/components/express-checkout"
import {
  PricingSelectCardGroup,
  PricingSelectCardStacked,
} from "@/registry/new-york/blocks/pricing-select-cards/components/pricing-select-card"
import { Button } from "@/registry/new-york/ui/button"
import { useResolvedTheme } from "@/app/theme"
import { Example, paddleEnv, RequiresPaddle } from "./shared"

const planNames = ["Starter", "Pro", "Business"]

export default function ExpressCheckoutPreview() {
  const theme = useResolvedTheme()
  const plans = paddleEnv.priceIds.map((priceId, i) => ({
    priceId,
    name: planNames[i] ?? `Plan ${i + 1}`,
    badge: i === 1 ? "Most popular" : undefined,
  }))

  return (
    <RequiresPaddle>
      <Example title="Stacked" description="Opens the Paddle checkout in a drawer.">
        <div className="max-w-md">
          <ExpressCheckout
            clientToken={paddleEnv.clientToken}
            environment={paddleEnv.environment}
            plans={plans}
            theme={theme}
            onComplete={(data) => console.info("[preview] checkout complete", data)}
            onError={(error) => console.error("[preview] checkout error", error)}
          />
        </div>
      </Example>
      <Example title="Grid">
        <ExpressCheckout
          clientToken={paddleEnv.clientToken}
          environment={paddleEnv.environment}
          plans={plans}
          theme={theme}
          layout="grid"
        />
      </Example>
    </RequiresPaddle>
  )
}

/** Static stand-in: the real block fetches prices from Paddle. */
export function Thumbnail() {
  const [value, setValue] = React.useState("pri_pro")
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <PricingSelectCardGroup value={value} onValueChange={setValue}>
        <PricingSelectCardStacked
          priceId="pri_starter"
          name="Starter"
          priceData={{ total: "$12.00", interval: "month" }}
        />
        <PricingSelectCardStacked
          priceId="pri_pro"
          name="Pro"
          badge="Most popular"
          priceData={{ total: "$29.00", interval: "month" }}
        />
      </PricingSelectCardGroup>
      <Button className="w-full">Subscribe now</Button>
    </div>
  )
}
