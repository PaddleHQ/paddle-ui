import type { Environments } from "@/registry/new-york/blocks/paddle-client/lib/paddle-sdk-types"
import { useHydrated } from "@/app/theme"

export function Example({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="font-medium">{title}</h2>
        {description && <p className="text-sm text-brand-muted">{description}</p>}
      </div>
      {/* Frame mirrors the docs demo frame (paddle-ui-demos/_layout.tsx). The stage inside
          uses the registry tokens so components render as consumers will see them. */}
      <div className="overflow-hidden rounded-lg border border-brand-line">
        <div className="border-b border-brand-line bg-brand-subtle/30 px-4 py-2 text-xs font-medium uppercase tracking-wide text-brand-muted">
          Preview
        </div>
        <div className="preview-stage p-6 text-foreground">{children}</div>
      </div>
    </section>
  )
}

/** ISO date `days` from now, so relative copy like "trial ends in 5 days" stays realistic. */
export function daysFromNow(days: number): string {
  const date = new Date()
  date.setUTCHours(0, 0, 0, 0)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString()
}

function csv(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

// Read with literal property access so Next inlines them into the client bundle.
export const paddleEnv = {
  clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "",
  environment: (process.env.NEXT_PUBLIC_PADDLE_ENV ?? "sandbox") as Environments,
  priceIds: csv(process.env.NEXT_PUBLIC_PREVIEW_PRICE_IDS),
  annualPriceIds: csv(process.env.NEXT_PUBLIC_PREVIEW_ANNUAL_PRICE_IDS),
}

export function RequiresPaddle({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated()
  const missing = [
    !paddleEnv.clientToken && "NEXT_PUBLIC_PADDLE_CLIENT_TOKEN",
    paddleEnv.priceIds.length === 0 && "NEXT_PUBLIC_PREVIEW_PRICE_IDS",
  ].filter(Boolean)

  // Paddle checkout reads `theme` once when it opens; mounting during hydration would
  // open it in light mode and then reopen it in dark.
  if (missing.length === 0) return hydrated ? <>{children}</> : null

  return (
    <div className="rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm">
      <p className="font-medium">This block talks to Paddle.js and needs sandbox credentials.</p>
      <p className="mt-1 text-muted-foreground">
        Copy <code>.env.example</code> to <code>.env.local</code>, set{" "}
        {missing.map((name, i) => (
          <span key={name as string}>
            {i > 0 && " and "}
            <code>{name}</code>
          </span>
        ))}
        , then restart <code>pnpm dev</code>.
      </p>
    </div>
  )
}
