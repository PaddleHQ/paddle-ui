"use client"

import * as React from "react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/registry/new-york/ui/drawer"
import { Skeleton } from "@/registry/new-york/ui/skeleton"
import { useCheckoutDrawer } from "../hooks/use-checkout-drawer"
import type {
  OpenCheckoutOptions,
  CheckoutCustomer,
  Environments,
} from "@/registry/new-york/blocks/paddle-client/lib/paddle-sdk-types"
import type { CheckoutCompleteData } from "@/registry/new-york/blocks/paddle-helpers/lib/paddle-types"

/** Props for the `ExpressCheckoutDrawer` component. */
export type ExpressCheckoutDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  priceId: string
  clientToken: string
  environment?: Environments
  customer?: CheckoutCustomer
  discountCode?: string
  discountId?: string
  customData?: Record<string, unknown>
  theme?: "light" | "dark"
  locale?: string
  showNonExpressPaymentMethods?: boolean
  onComplete?: (data: CheckoutCompleteData) => void
  onError?: (error: Error) => void
}

export function ExpressCheckoutDrawer({
  open,
  onOpenChange,
  priceId,
  clientToken,
  environment = "production",
  customer,
  discountCode,
  discountId,
  customData,
  theme,
  locale,
  showNonExpressPaymentMethods,
  onComplete,
  onError,
}: ExpressCheckoutDrawerProps) {
  const { openCheckout, closeCheckout, checkoutHeight, isReady } = useCheckoutDrawer({
    clientToken,
    environment,
    theme,
    locale,
    showNonExpressPaymentMethods,
    onComplete,
    onError,
  })

  const [checkoutLoaded, setCheckoutLoaded] = React.useState(false)

  // Stable ref — effects re-run only when actual values change
  const stableCustomer = React.useMemo(
    () => customer,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      customer?.id,
      customer?.email,
      customer?.address?.id,
      customer?.address?.countryCode,
      customer?.address?.postalCode,
      customer?.address?.region,
      customer?.address?.city,
      customer?.address?.firstLine,
      customer?.business?.id,
      customer?.business?.name,
      customer?.business?.taxIdentifier,
    ]
  )

  const stableCustomData = React.useMemo(
    () => customData,
    // JSON.stringify is the most pragmatic deep-compare for Record<string, unknown>
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(customData)]
  )

  React.useEffect(() => {
    if (open && isReady && priceId) {
      setCheckoutLoaded(false)
      // Delay until drawer is fully mounted and visible
      const timeoutId = setTimeout(() => {
        const options: OpenCheckoutOptions = {
          priceId,
          ...(stableCustomer && { customer: stableCustomer }),
          ...(discountCode ? { discountCode } : discountId ? { discountId } : {}),
          ...(stableCustomData && { customData: stableCustomData }),
        }
        openCheckout(options)
        // Brief delay for Paddle to render before showing content
        setTimeout(() => setCheckoutLoaded(true), 500)
      }, 300)

      return () => clearTimeout(timeoutId)
    }
  }, [
    open,
    isReady,
    priceId,
    stableCustomer,
    discountCode,
    discountId,
    stableCustomData,
    openCheckout,
  ])

  React.useEffect(() => {
    if (!open) {
      closeCheckout()
      setCheckoutLoaded(false)
    }
  }, [open, closeCheckout])

  return (
    <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <DrawerContent className="max-h-[80vh]">
        {/* Hidden title and description for accessibility */}
        <DrawerTitle className="sr-only">Checkout</DrawerTitle>
        <DrawerDescription className="sr-only">
          Complete your purchase using the checkout form below.
        </DrawerDescription>
        {/* Inner container handles height transitions separately from Vaul's drawer animation */}
        <div
          style={{ height: checkoutHeight }}
          className="overflow-hidden transition-[height] duration-300 ease-out motion-reduce:transition-none motion-reduce:duration-0"
        >
          <div className="h-full overflow-y-auto p-4">
            {!checkoutLoaded && (
              <div className="flex flex-col items-center gap-4 p-4">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-3/4 rounded-lg" />
              </div>
            )}
            <div className="checkout-container w-full min-h-[180px]" />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
