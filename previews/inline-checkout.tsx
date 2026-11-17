"use client"

import { InlineCheckout } from "@/registry/new-york/blocks/inline-checkout/components/inline-checkout"
import { CheckoutSummary } from "@/registry/new-york/blocks/checkout-summary/components/checkout-summary"
import { useResolvedTheme } from "@/app/theme"
import { Example, paddleEnv, RequiresPaddle } from "./shared"

export default function InlineCheckoutPreview() {
  const theme = useResolvedTheme()

  return (
    <RequiresPaddle>
      <Example
        title="One-page checkout"
        description="Uses the first price in NEXT_PUBLIC_PREVIEW_PRICE_IDS. Events are logged to the console."
      >
        <InlineCheckout
          // Paddle applies `theme` only when the frame opens, so remount on change.
          key={theme}
          clientToken={paddleEnv.clientToken}
          environment={paddleEnv.environment}
          items={[{ priceId: paddleEnv.priceIds[0], quantity: 1 }]}
          theme={theme}
          policyUrl="https://www.paddle.com/legal/refund-policy"
          onEvent={(event) => console.info("[preview] paddle event", event.name, event)}
          onComplete={(data) => console.info("[preview] checkout complete", data)}
          onError={(error) => console.error("[preview] checkout error", error)}
        />
      </Example>
    </RequiresPaddle>
  )
}

/** Static stand-in: the real block embeds Paddle's checkout frame. */
export function Thumbnail() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <CheckoutSummary
        summary={{
          currency: "USD",
          items: [{ name: "Pro", priceName: "Monthly", quantity: 1, lineTotal: 29 }],
          subtotal: 29,
          tax: 5.8,
          total: 34.8,
          recurringTotal: 34.8,
          recurringInterval: "month",
          recurringFrequency: 1,
        }}
      />
      <div className="flex flex-col gap-3 rounded-lg border p-6">
        {["Email", "Card number", "Expiry", "Country"].map((label) => (
          <div key={label} className="flex flex-col gap-1.5">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="h-9 rounded-md border bg-background" />
          </div>
        ))}
        <div className="mt-2 h-10 rounded-md bg-primary" />
      </div>
    </div>
  )
}
