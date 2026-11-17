"use client"

import { InlineCheckout } from "@/registry/new-york/blocks/inline-checkout/components/inline-checkout"
import { Example, paddleEnv, RequiresPaddle } from "./shared"

export default function InlineCheckoutPreview() {
  return (
    <RequiresPaddle>
      <Example
        title="One-page checkout"
        description="Uses the first price in NEXT_PUBLIC_PREVIEW_PRICE_IDS. Events are logged to the console."
      >
        <InlineCheckout
          clientToken={paddleEnv.clientToken}
          environment={paddleEnv.environment}
          items={[{ priceId: paddleEnv.priceIds[0], quantity: 1 }]}
          policyUrl="https://www.paddle.com/legal/refund-policy"
          onEvent={(event) => console.info("[preview] paddle event", event.name, event)}
          onComplete={(data) => console.info("[preview] checkout complete", data)}
          onError={(error) => console.error("[preview] checkout error", error)}
        />
      </Example>
    </RequiresPaddle>
  )
}
