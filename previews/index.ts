import type { ComponentType } from "react"
import BillingIntervalTogglePreview from "./billing-interval-toggle"
import CheckoutSummaryPreview from "./checkout-summary"
import ExpressCheckoutPreview from "./express-checkout"
import InlineCheckoutPreview from "./inline-checkout"
import PlanChangeBreakdownPreview from "./plan-change-breakdown"
import PlanChangePreviewPreview from "./plan-change-preview"
import PricingCardsPreview from "./pricing-cards"
import PricingDisplayPreview from "./pricing-display"
import PricingSelectCardsPreview from "./pricing-select-cards"
import SubscriptionAlertPreview from "./subscription-alert"
import SubscriptionPaymentCardPreview from "./subscription-payment-card"
import SubscriptionStatusCardPreview from "./subscription-status-card"

/** Keyed by registry item name. Add an entry here when adding an item to registry.json. */
export const previews: Record<string, ComponentType> = {
  "billing-interval-toggle": BillingIntervalTogglePreview,
  "checkout-summary": CheckoutSummaryPreview,
  "express-checkout": ExpressCheckoutPreview,
  "inline-checkout": InlineCheckoutPreview,
  "plan-change-breakdown": PlanChangeBreakdownPreview,
  "plan-change-preview": PlanChangePreviewPreview,
  "pricing-cards": PricingCardsPreview,
  "pricing-display": PricingDisplayPreview,
  "pricing-select-cards": PricingSelectCardsPreview,
  "subscription-alert": SubscriptionAlertPreview,
  "subscription-payment-card": SubscriptionPaymentCardPreview,
  "subscription-status-card": SubscriptionStatusCardPreview,
}
