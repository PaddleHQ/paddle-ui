"use client"

import * as React from "react"
import { PricingSelectCardStacked } from "@/registry/new-york/blocks/pricing-select-cards/components/pricing-select-card-stacked"
import { PricingSelectCardGrid } from "@/registry/new-york/blocks/pricing-select-cards/components/pricing-select-card-grid"
import { PricingSelectCardGroup } from "@/registry/new-york/blocks/pricing-select-cards/components/pricing-select-card-group"
import { usePaddlePrices } from "@/registry/new-york/blocks/paddle-client/lib/hooks/use-paddle-prices"
import { ExpressCheckoutDrawer } from "./express-checkout-drawer"
import { Button } from "@/registry/new-york/ui/button"
import type {
  CheckoutCompleteData,
  CheckoutCustomer,
  Environments,
} from "@/registry/new-york/blocks/paddle-client/lib/paddle-types"
import type { PricingSelectPlan } from "@/registry/new-york/blocks/pricing-select-cards/components/pricing-select-card"
import { cn } from "@/lib/utils"

/** Props for the `ExpressCheckout` component. */
export type ExpressCheckoutProps = {
  clientToken: string
  environment?: Environments
  plans: PricingSelectPlan[]
  defaultPriceId?: string
  layout?: "stacked" | "grid"
  customer?: CheckoutCustomer
  discountCode?: string
  discountId?: string
  customData?: Record<string, unknown>
  theme?: "light" | "dark"
  locale?: string
  showNonExpressPaymentMethods?: boolean
  onComplete?: (data: CheckoutCompleteData) => void
  onError?: (error: Error) => void
  submitLabel?: string
  className?: string
}

export function ExpressCheckout({
  clientToken,
  environment = "production",
  plans,
  defaultPriceId,
  layout = "stacked",
  customer,
  discountCode,
  discountId,
  customData,
  theme,
  locale,
  showNonExpressPaymentMethods,
  onComplete,
  onError,
  submitLabel = "Subscribe now",
  className,
}: ExpressCheckoutProps) {
  const [selectedPlan, setSelectedPlan] = React.useState(defaultPriceId || plans[0]?.priceId || "")
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const selectedPlanName = plans.find((p) => p.priceId === selectedPlan)?.name

  const { prices, loading, error } = usePaddlePrices({
    clientToken,
    environment,
    priceIds: plans.map((plan) => plan.priceId),
    countryCode: customer?.address?.countryCode,
  })

  if (error) {
    return (
      <div className="text-destructive rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm">
        Failed to load pricing: {error.message}
      </div>
    )
  }

  return (
    <div className={cn("w-full max-w-md space-y-6", className)}>
      <PricingSelectCardGroup value={selectedPlan} onValueChange={setSelectedPlan} layout={layout}>
        {plans.map((plan) =>
          layout === "grid" ? (
            <PricingSelectCardGrid
              key={plan.priceId}
              priceId={plan.priceId}
              name={plan.name}
              priceData={prices[plan.priceId]}
              badge={plan.badge}
              loading={loading}
            />
          ) : (
            <PricingSelectCardStacked
              key={plan.priceId}
              priceId={plan.priceId}
              name={plan.name}
              priceData={prices[plan.priceId]}
              description={plan.description}
              badge={plan.badge}
              icon={plan.icon}
              loading={loading}
            />
          )
        )}
      </PricingSelectCardGroup>

      <Button
        className="w-full"
        size="lg"
        onClick={() => setDrawerOpen(true)}
        disabled={loading || !selectedPlan}
        aria-label={selectedPlanName ? `${submitLabel} - ${selectedPlanName}` : submitLabel}
      >
        {submitLabel}
      </Button>

      <ExpressCheckoutDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        priceId={selectedPlan}
        clientToken={clientToken}
        environment={environment}
        customer={customer}
        discountCode={discountCode}
        discountId={discountId}
        customData={customData}
        theme={theme}
        locale={locale}
        showNonExpressPaymentMethods={showNonExpressPaymentMethods}
        onComplete={onComplete}
        onError={onError}
      />
    </div>
  )
}
