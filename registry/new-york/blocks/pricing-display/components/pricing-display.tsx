"use client"

import * as React from "react"
import { PricingTierCard } from "@/registry/new-york/blocks/pricing-cards/components/pricing-tier-card"
import { PricingTierCardGroup } from "@/registry/new-york/blocks/pricing-cards/components/pricing-tier-card-group"
import { usePaddlePrices } from "@/registry/new-york/blocks/paddle-client/lib/hooks/use-paddle-prices"
import {
  getOrCreatePaddle,
  addPaddleEventListener,
} from "@/registry/new-york/blocks/paddle-client/lib/paddle-instance"
import { BillingIntervalToggle } from "@/registry/new-york/blocks/billing-interval-toggle/components/billing-interval-toggle"
import { cn } from "@/lib/utils"
import { formatIntervalLabel } from "@/registry/new-york/blocks/paddle-helpers/lib/paddle-format"
import type {
  Environments,
  CheckoutEventsData,
  PaddleEventData,
  TimePeriod,
} from "@/registry/new-york/blocks/paddle-client/lib/paddle-sdk-types"
import type { CheckoutCompleteData } from "@/registry/new-york/blocks/paddle-helpers/lib/paddle-types"

// Local alias for the interval string union from Paddle's TimePeriod.
// Uses the SDK's source of truth directly rather than a duplicated type.
type Interval = TimePeriod["interval"]

/** Plan configuration for the `PricingDisplay` component. */
export type PricingDisplayPlan = {
  priceId?: string | Partial<Record<Interval, string>>
  name: string
  description?: string
  features?: string[]
  badge?: string
  badgePosition?: "left" | "center" | "right"
  icon?: React.ReactNode
  ctaLabel?: string
  onSelect?: () => void
}

/** Props for the `PricingDisplay` component. */
export type PricingDisplayProps = {
  plans: PricingDisplayPlan[]
  clientToken: string
  environment?: Environments
  countryCode?: string
  discountId?: string
  showOriginalPrice?: boolean
  currentPriceIds?: string[]
  selectedPriceId?: string
  onPlanSelect?: (priceId: string) => void
  onCheckoutComplete?: (data: CheckoutCompleteData) => void
  className?: string
}

const INTERVAL_ORDER: Interval[] = ["day", "week", "month", "year"]

function getAllPriceIds(plans: PricingDisplayPlan[]): string[] {
  return plans.flatMap((plan) => {
    if (!plan.priceId) return []
    if (typeof plan.priceId === "string") return [plan.priceId]
    return Object.values(plan.priceId).filter(Boolean) as string[]
  })
}

function getIntervals(plans: PricingDisplayPlan[]): Interval[] {
  const multiIntervalPlans = plans.filter(
    (p) => p.priceId !== undefined && typeof p.priceId !== "string"
  )
  if (multiIntervalPlans.length === 0) return []
  const allKeys = multiIntervalPlans.flatMap(
    (p) => Object.keys(p.priceId as Partial<Record<Interval, string>>) as Interval[]
  )
  const unique = new Set(allKeys)
  return INTERVAL_ORDER.filter((i) => unique.has(i))
}

function getActivePriceId(plan: PricingDisplayPlan, interval: Interval): string {
  if (!plan.priceId) return ""
  if (typeof plan.priceId === "string") return plan.priceId
  return (plan.priceId as Partial<Record<Interval, string>>)[interval] ?? ""
}

// True when ANY of the plan's price IDs (across all intervals) appear in
// currentPriceIds. Used for the plan-tier badge — passing the monthly price ID
// marks the plan as "current" on both the monthly and annual tabs.
function isPlanCurrentTier(plan: PricingDisplayPlan, currentPriceIds: string[]): boolean {
  if (!plan.priceId) return false
  const ids =
    typeof plan.priceId === "string"
      ? [plan.priceId]
      : (Object.values(plan.priceId).filter(Boolean) as string[])
  return ids.some((id) => currentPriceIds.includes(id))
}

export function PricingDisplay({
  plans,
  clientToken,
  environment = "production",
  countryCode,
  discountId,
  showOriginalPrice = true,
  currentPriceIds,
  selectedPriceId,
  onPlanSelect,
  onCheckoutComplete,
  className,
}: PricingDisplayProps) {
  const intervals = React.useMemo(() => getIntervals(plans), [plans])
  const hasMultiInterval = intervals.length > 1

  const [selectedInterval, setSelectedInterval] = React.useState<string>(intervals[0] ?? "")

  // Reset to first valid interval when plans change
  React.useEffect(() => {
    if (selectedInterval && !intervals.includes(selectedInterval as Interval)) {
      setSelectedInterval(intervals[0] ?? "")
    }
  }, [intervals, selectedInterval])

  const resolvedInterval = intervals.includes(selectedInterval as Interval)
    ? selectedInterval
    : (intervals[0] ?? "")

  const allPriceIds = React.useMemo(() => getAllPriceIds(plans), [plans])

  // Set of plans whose price IDs overlap with currentPriceIds (any interval).
  // Stored by object identity so the render loop avoids index arithmetic.
  const currentPlanSet = React.useMemo<Set<PricingDisplayPlan>>(() => {
    if (!currentPriceIds?.length) return new Set()
    const matches = plans.filter((p) => isPlanCurrentTier(p, currentPriceIds))
    if (process.env.NODE_ENV !== "production" && matches.length > 1) {
      console.warn(
        `[PricingDisplay] currentPriceIds matched ${matches.length} plans. ` +
          "Each price ID should belong to exactly one plan. Only the first match will be treated as current."
      )
    }
    return new Set(matches.length > 1 ? [matches[0]] : matches)
  }, [plans, currentPriceIds])

  const { prices, loading, error } = usePaddlePrices({
    clientToken,
    environment,
    priceIds: allPriceIds,
    countryCode,
    discountId,
  })

  // Ref avoids stale closure in event listener
  const onCheckoutCompleteRef = React.useRef(onCheckoutComplete)
  React.useEffect(() => {
    onCheckoutCompleteRef.current = onCheckoutComplete
  }, [onCheckoutComplete])

  // Subscribe to checkout.completed when handler is provided
  React.useEffect(() => {
    if (!onCheckoutComplete) return

    const unsubscribe = addPaddleEventListener((event: PaddleEventData) => {
      if (event.name === "checkout.completed" && onCheckoutCompleteRef.current) {
        const data = event.data as CheckoutEventsData
        onCheckoutCompleteRef.current({
          transactionId: data?.transaction_id ?? "",
          customerId: data?.customer?.id ?? "",
          customerEmail: data?.customer?.email ?? "",
        })
      }
    })

    return unsubscribe
  }, [onCheckoutComplete])

  const handleCardSelect = React.useCallback(
    async (priceId: string) => {
      if (onPlanSelect) {
        onPlanSelect(priceId)
        return
      }

      // Default: open overlay checkout
      const paddle = await getOrCreatePaddle(clientToken, environment)
      paddle?.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        ...(discountId && { discountId }),
      })
    },
    [onPlanSelect, clientToken, environment, discountId]
  )

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load pricing: {error.message}
      </div>
    )
  }

  // undefined = checkout mode; onPlanSelect or selectedPriceId = selection mode (CTA labels auto-switch)
  const isSelectionMode = onPlanSelect !== undefined || selectedPriceId !== undefined

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {hasMultiInterval && (
        <BillingIntervalToggle
          intervals={intervals}
          value={resolvedInterval}
          onValueChange={setSelectedInterval}
        />
      )}

      <PricingTierCardGroup>
        {plans.map((plan, index) => {
          const activePriceId = getActivePriceId(plan, resolvedInterval as Interval)
          const rawPriceData = prices[activePriceId]
          const priceData =
            rawPriceData && !showOriginalPrice
              ? { ...rawPriceData, originalTotal: undefined }
              : rawPriceData

          const isCurrent = currentPlanSet.has(plan) // any-interval tier match (badge)
          const isCurrentPrice = !!currentPriceIds?.includes(activePriceId) // exact price match (CTA disabled)
          // undefined = checkout mode; defined (true/false) = selection mode
          const isSelected = isSelectionMode ? activePriceId === selectedPriceId : undefined

          // CTA label priority: explicit override > switch-interval (checkout only) > selection-mode > card default
          const resolvedCtaLabel =
            plan.ctaLabel ??
            (isCurrent && !isCurrentPrice && !isSelectionMode
              ? `Switch to ${formatIntervalLabel(resolvedInterval, "adjective")}`
              : isSelectionMode
                ? isSelected
                  ? "Selected"
                  : isCurrentPrice
                    ? undefined // falls through to card default: "Current plan"
                    : "Select plan"
                : undefined)

          // Custom onSelect (e.g. "Contact Sales") stays active on current plan
          const isDisabled = isCurrentPrice && !plan.onSelect

          const onSelectHandler: (() => void) | undefined = plan.onSelect
            ? plan.onSelect
            : activePriceId
              ? () => handleCardSelect(activePriceId)
              : undefined

          return (
            <PricingTierCard
              key={activePriceId || index}
              name={plan.name}
              priceData={priceData}
              description={plan.description}
              features={plan.features}
              badge={plan.badge}
              badgePosition={plan.badgePosition}
              icon={plan.icon}
              ctaLabel={resolvedCtaLabel}
              loading={loading && !!activePriceId}
              onSelect={isDisabled ? undefined : onSelectHandler}
              isSelected={isSelected}
              isCurrent={isCurrent}
            />
          )
        })}
      </PricingTierCardGroup>
    </div>
  )
}
