"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import type {
  PaddleEventData,
  CheckoutSettings,
} from "@/registry/new-york/blocks/paddle-client/lib/paddle-sdk-types"
import { addPaddleEventListener } from "@/registry/new-york/blocks/paddle-client/lib/paddle-instance"
import {
  useCheckout,
  type UseCheckoutArgs,
} from "@/registry/new-york/blocks/paddle-client/lib/hooks/use-checkout"

const INITIAL_HEIGHT = 220
const PADDING = 95 // Inflated due to Paddle iframe sizing bug, will be reduced to ~40 once fixed

// checkout.ping.size carries a height field not yet in @paddle/paddle-js types
type PaddlePingSizeEvent = PaddleEventData & { height?: number }

// Express checkout settings — passed explicitly to useCheckout to match the
// checkout-container target div rendered in ExpressCheckoutDrawer.
const EXPRESS_SETTINGS: CheckoutSettings = {
  displayMode: "inline",
  variant: "express",
  frameTarget: "checkout-container",
  frameInitialHeight: 180,
  frameStyle: "width: 100%; border: 0;",
}

export type UseCheckoutDrawerArgs = Omit<UseCheckoutArgs, "checkoutSettings">

export function useCheckoutDrawer(args: UseCheckoutDrawerArgs) {
  const { openCheckout, closeCheckout, isReady } = useCheckout({
    ...args,
    checkoutSettings: EXPRESS_SETTINGS,
  })

  const [checkoutHeight, setCheckoutHeight] = useState(INITIAL_HEIGHT)
  const heightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounce height updates for smooth drawer transitions
  const setHeightDebounced = useCallback((height: number) => {
    if (heightTimeoutRef.current) {
      clearTimeout(heightTimeoutRef.current)
    }
    heightTimeoutRef.current = setTimeout(() => {
      const maxHeight = window.innerHeight * 0.8
      setCheckoutHeight(Math.min(height + PADDING, maxHeight))
    }, 50)
  }, [])

  // Track drawer height via checkout.ping.size events
  useEffect(() => {
    const unsubscribe = addPaddleEventListener((event) => {
      const { type, height } = event as PaddlePingSizeEvent
      if (type === "checkout.ping.size" && height) {
        setHeightDebounced(height)
      }
    })

    return unsubscribe
  }, [setHeightDebounced])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (heightTimeoutRef.current) {
        clearTimeout(heightTimeoutRef.current)
      }
    }
  }, [])

  return {
    openCheckout,
    closeCheckout,
    checkoutHeight,
    isReady,
  }
}
