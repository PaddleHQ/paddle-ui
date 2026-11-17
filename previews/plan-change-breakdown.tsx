"use client"

import { PlanChangeBreakdown } from "@/registry/new-york/blocks/plan-change-breakdown/components/plan-change-breakdown"
import type { PlanChangeBreakdownData } from "@/registry/new-york/blocks/paddle-helpers/lib/paddle-types"
import { daysFromNow, Example } from "./shared"

const upgrade: PlanChangeBreakdownData = {
  currency: "USD",
  result: { direction: "charge", amount: 8.77 },
  breakdown: { credit: 6.19, charge: 14.96 },
  immediateTransaction: {
    lineItems: [
      {
        productName: "Starter",
        quantity: 1,
        unitPrice: 12,
        total: -6.19,
        isProrated: true,
        prorationPeriod: "16 of 31 days",
      },
      {
        productName: "Pro",
        quantity: 1,
        unitPrice: 29,
        total: 14.96,
        isProrated: true,
        prorationPeriod: "16 of 31 days",
      },
    ],
    totals: { subtotal: 8.77, tax: 1.75, total: 10.52 },
  },
  recurringTransaction: {
    lineItems: [{ productName: "Pro", quantity: 1, unitPrice: 29, total: 34.8 }],
    totals: { subtotal: 29, tax: 5.8, total: 34.8 },
  },
}

const downgrade: PlanChangeBreakdownData = {
  currency: "EUR",
  result: { direction: "credit", amount: 36.13 },
  breakdown: { credit: 51.1, charge: 14.97 },
  nextTransaction: {
    billingDate: daysFromNow(16),
    lineItems: [
      { productName: "Pro", quantity: 1, unitPrice: 29, total: 34.8 },
      { productName: "Extra seats", quantity: 3, unitPrice: 10, total: 36 },
    ],
    totals: {
      subtotal: 59,
      discount: 5.9,
      tax: 10.62,
      credit: 36.13,
      creditToBalance: 0,
      total: 27.59,
    },
  },
  recurringTransaction: {
    lineItems: [
      { productName: "Pro", quantity: 1, unitPrice: 29, total: 34.8 },
      { productName: "Extra seats", quantity: 3, unitPrice: 10, total: 36 },
    ],
    totals: { subtotal: 59, discount: 5.9, tax: 10.62, total: 63.72 },
  },
}

export default function PlanChangeBreakdownPreview() {
  return (
    <>
      <Example title="Upgrade, charged today">
        <PlanChangeBreakdown breakdown={upgrade} collectionMode="automatic" />
      </Example>
      <Example title="Upgrade, invoiced" description="collectionMode is manual">
        <PlanChangeBreakdown breakdown={upgrade} collectionMode="manual" />
      </Example>
      <Example title="Downgrade with credit and discount">
        <PlanChangeBreakdown breakdown={downgrade} />
      </Example>
      <Example title="Loading">
        <PlanChangeBreakdown />
      </Example>
    </>
  )
}
