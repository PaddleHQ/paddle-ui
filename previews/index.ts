import type { ComponentType } from "react"
import * as billingIntervalToggle from "./billing-interval-toggle"
import * as checkoutSummary from "./checkout-summary"
import * as expressCheckout from "./express-checkout"
import * as inlineCheckout from "./inline-checkout"
import * as planChangeBreakdown from "./plan-change-breakdown"
import * as planChangePreview from "./plan-change-preview"
import * as pricingCards from "./pricing-cards"
import * as pricingDisplay from "./pricing-display"
import * as pricingSelectCards from "./pricing-select-cards"
import * as subscriptionAlert from "./subscription-alert"
import * as subscriptionPaymentCard from "./subscription-payment-card"
import * as subscriptionStatusCard from "./subscription-status-card"

type PreviewModule = { default: ComponentType; Thumbnail?: ComponentType }

export type PreviewEntry = {
  /** Full page of states, shown at /<name>. */
  Preview: ComponentType
  /** One representative state for the gallery card. Falls back to Preview. */
  Thumbnail: ComponentType
  /** Scale applied to the thumbnail so wide components fit the card. */
  zoom: number
}

// Zoom lives here rather than in the preview modules: they are client modules, and a
// server component importing a plain value from one gets a reference, not the value.
function entry(mod: PreviewModule, zoom: number): PreviewEntry {
  return { Preview: mod.default, Thumbnail: mod.Thumbnail ?? mod.default, zoom }
}

/** Keyed by registry item name. Add an entry here when adding an item to registry.json. */
export const previews: Record<string, PreviewEntry> = {
  "billing-interval-toggle": entry(billingIntervalToggle, 1),
  "checkout-summary": entry(checkoutSummary, 0.6),
  "express-checkout": entry(expressCheckout, 0.6),
  "inline-checkout": entry(inlineCheckout, 0.45),
  "plan-change-breakdown": entry(planChangeBreakdown, 0.45),
  "plan-change-preview": entry(planChangePreview, 0.5),
  "pricing-cards": entry(pricingCards, 0.38),
  "pricing-display": entry(pricingDisplay, 0.38),
  "pricing-select-cards": entry(pricingSelectCards, 0.6),
  "subscription-alert": entry(subscriptionAlert, 0.55),
  "subscription-payment-card": entry(subscriptionPaymentCard, 0.6),
  "subscription-status-card": entry(subscriptionStatusCard, 0.5),
}
