import { describe, expect, it } from "vitest"
import { getPaymentMethodDisplay } from "@/registry/new-york/blocks/paddle-helpers/lib/paddle-payment-method-display"

describe("getPaymentMethodDisplay", () => {
  describe("cards", () => {
    it("shows brand and last 4 digits", () => {
      expect(getPaymentMethodDisplay("card", "visa", "4242")).toBe("Visa ending 4242")
    })

    it("shows the brand alone without last 4 digits", () => {
      expect(getPaymentMethodDisplay("card", "mastercard")).toBe("Mastercard")
    })

    it("falls back to Card without a brand", () => {
      expect(getPaymentMethodDisplay("card")).toBe("Card")
      expect(getPaymentMethodDisplay("card", undefined, "4242")).toBe("Card ending 4242")
    })

    it("title-cases unknown brands", () => {
      expect(getPaymentMethodDisplay("card", "new_brand", "1234")).toBe("New Brand ending 1234")
    })
  })

  it.each([
    ["paypal", "PayPal"],
    ["apple_pay", "Apple Pay"],
    ["ideal", "iDEAL"],
    ["south_korea_local_card", "Korea local card"],
    ["korea_local", "Korean payment methods"],
    ["unknown", "Payment method"],
  ])("labels %s as %s", (type, expected) => {
    expect(getPaymentMethodDisplay(type)).toBe(expected)
  })

  it("title-cases unknown payment method types", () => {
    expect(getPaymentMethodDisplay("future_wallet")).toBe("Future Wallet")
  })
})
