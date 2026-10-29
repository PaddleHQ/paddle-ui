import { describe, expect, it } from "vitest"
import {
  formatBillingCycle,
  formatDate,
  formatIntervalLabel,
  formatMoney,
  formatProrationMode,
  formatTrialPeriod,
  parseAmount,
} from "@/registry/new-york/blocks/paddle-helpers/lib/paddle-format"

describe("formatDate", () => {
  it("formats in en-US by default", () => {
    expect(formatDate("2024-01-15T12:00:00Z")).toBe("Jan 15, 2024")
  })

  it("respects the locale", () => {
    expect(formatDate("2024-01-15T12:00:00Z", "en-GB")).toBe("15 Jan 2024")
  })
})

describe("formatBillingCycle", () => {
  it("returns the bare interval for a frequency of 1", () => {
    expect(formatBillingCycle({ frequency: 1, interval: "month" })).toBe("month")
  })

  it("pluralises for frequencies above 1", () => {
    expect(formatBillingCycle({ frequency: 3, interval: "month" })).toBe("3 months")
  })

  it("returns undefined without a billing cycle", () => {
    expect(formatBillingCycle(null)).toBeUndefined()
    expect(formatBillingCycle(undefined)).toBeUndefined()
  })
})

describe("formatTrialPeriod", () => {
  it.each([
    [{ frequency: 1, interval: "month" }, "1 month"],
    [{ frequency: 7, interval: "day" }, "7 days"],
    [{ frequency: 2, interval: "week" }, "2 weeks"],
  ])("formats %o as %s", (period, expected) => {
    expect(formatTrialPeriod(period)).toBe(expected)
  })
})

describe("formatMoney", () => {
  it.each([
    [29.99, "USD", "$29.99"],
    [12, "USD", "$12.00"],
    [1500, "JPY", "¥1,500"],
    [-5, "USD", "-$5.00"],
    [0, "EUR", "€0.00"],
  ])("formats %d %s as %s", (amount, currency, expected) => {
    expect(formatMoney(amount, currency)).toBe(expected)
  })

  it("respects the locale", () => {
    expect(formatMoney(12, "GBP", "en-GB")).toBe("£12.00")
  })
})

describe("parseAmount", () => {
  it.each([
    ["1500", "USD", 15],
    ["999", "USD", 9.99],
    ["0", "GBP", 0],
    ["-500", "EUR", -5],
  ])("converts %s %s from minor units to %d", (raw, currency, expected) => {
    expect(parseAmount(raw, currency)).toBe(expected)
  })

  it.each(["JPY", "KRW", "VND", "CLP"])(
    "leaves zero-decimal %s amounts as whole units",
    (currency) => {
      expect(parseAmount("1500", currency)).toBe(1500)
    }
  )

  it("matches zero-decimal currencies case-insensitively", () => {
    expect(parseAmount("1500", "jpy")).toBe(1500)
  })
})

describe("formatProrationMode", () => {
  it.each([
    ["prorated_immediately", "Charge prorated amount now"],
    ["full_immediately", "Charge full amount now"],
    ["prorated_next_billing_period", "Prorated at next billing"],
    ["full_next_billing_period", "Full charge at next billing"],
    ["do_not_bill", "No charge"],
  ])("labels %s", (mode, expected) => {
    expect(formatProrationMode(mode)).toBe(expected)
  })

  it("passes unknown modes through unchanged", () => {
    expect(formatProrationMode("something_new")).toBe("something_new")
  })
})

describe("formatIntervalLabel", () => {
  it.each([
    ["day", "Daily", "daily"],
    ["week", "Weekly", "weekly"],
    ["month", "Monthly", "monthly"],
    ["year", "Annually", "annual"],
  ])("labels %s", (interval, noun, adjective) => {
    expect(formatIntervalLabel(interval)).toBe(noun)
    expect(formatIntervalLabel(interval, "noun")).toBe(noun)
    expect(formatIntervalLabel(interval, "adjective")).toBe(adjective)
  })

  it("capitalises unknown intervals", () => {
    expect(formatIntervalLabel("fortnight")).toBe("Fortnight")
  })
})
