"use client"

import { ExpressCheckout } from "@/registry/new-york/blocks/express-checkout/components/express-checkout"
import { Example, paddleEnv, RequiresPaddle } from "./shared"

const planNames = ["Starter", "Pro", "Business"]

export default function ExpressCheckoutPreview() {
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
          layout="grid"
        />
      </Example>
    </RequiresPaddle>
  )
}
