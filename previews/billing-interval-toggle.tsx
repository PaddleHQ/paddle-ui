"use client"

import * as React from "react"
import { BillingIntervalToggle } from "@/registry/new-york/blocks/billing-interval-toggle/components/billing-interval-toggle"
import { Example } from "./shared"

export default function BillingIntervalTogglePreview() {
  const [twoWay, setTwoWay] = React.useState("month")
  const [fourWay, setFourWay] = React.useState("year")

  return (
    <>
      <Example title="Monthly / annually">
        <BillingIntervalToggle
          intervals={["month", "year"]}
          value={twoWay}
          onValueChange={setTwoWay}
        />
      </Example>
      <Example title="All intervals">
        <BillingIntervalToggle
          intervals={["day", "week", "month", "year"]}
          value={fourWay}
          onValueChange={setFourWay}
        />
      </Example>
    </>
  )
}
