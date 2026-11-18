import Link from "next/link"
import registry from "@/registry.json"
import { previews, type PreviewEntry } from "@/previews"

type RegistryItem = (typeof registry.items)[number] & { categories?: string[] }

function ThumbnailFrame({ entry }: { entry: PreviewEntry }) {
  const { Thumbnail, zoom } = entry
  return (
    // inert: the card is one big link, so the live component must not take focus or clicks.
    <div
      inert
      className="preview-stage relative h-64 overflow-hidden border-b border-brand-line text-foreground"
    >
      <div className="absolute inset-0 flex items-center-safe justify-center p-6">
        <div style={{ zoom, width: `${100 / zoom}%` }}>
          <Thumbnail />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}

function ItemCard({ item }: { item: RegistryItem }) {
  const entry = previews[item.name]
  return (
    // Stretched link: thumbnails can contain their own <a>, so the card can't be one.
    <li className="group relative flex flex-col overflow-hidden rounded-lg border border-brand-line bg-brand-surface transition-all focus-within:ring-2 focus-within:ring-brand-ink hover:-translate-y-0.5 hover:border-brand-muted/40 hover:shadow-brand-key">
      {entry ? (
        <ThumbnailFrame entry={entry} />
      ) : (
        <div className="flex h-64 items-center justify-center border-b border-brand-line text-sm text-destructive">
          No preview in previews/index.ts
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <span className="flex items-center justify-between gap-2">
          <Link
            href={`/${item.name}`}
            className="font-medium outline-none after:absolute after:inset-0"
          >
            <span className="bg-[linear-gradient(var(--brand-highlight),var(--brand-highlight))] bg-[length:0%_40%] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_40%]">
              {item.title}
            </span>
          </Link>
          <span className="font-brand-mono text-[11px] uppercase tracking-wider text-brand-muted">
            {item.type.replace("registry:", "")}
          </span>
        </span>
        <span className="line-clamp-2 text-sm text-brand-muted">{item.description}</span>
      </div>
    </li>
  )
}

export default function Home() {
  const items = (registry.items as RegistryItem[]).filter((item) => item.type !== "registry:lib")

  const groups = new Map<string, RegistryItem[]>()
  for (const item of items) {
    const category = item.categories?.[0] ?? "other"
    groups.set(category, [...(groups.get(category) ?? []), item])
  }

  return (
    <main className="px-4 pb-20 sm:px-6 lg:px-8">
      <section className="py-14 sm:py-20">
        <p className="font-brand-mono text-xs uppercase tracking-widest text-brand-muted">
          shadcn/ui registry · {items.length} components
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Billing UI for{" "}
          <span className="bg-brand-highlight px-1 text-brand-highlight-ink">Paddle</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-brand-muted">
          Pricing, checkout, and subscription components, rendered here with fixture data. Open one
          to see every state.
        </p>
        <pre className="mt-8 inline-block max-w-full overflow-x-auto rounded-lg bg-brand-ink px-4 py-3 font-brand-mono text-sm text-brand-surface">
          <span className="text-brand-highlight">$</span> pnpm dlx shadcn@latest registry add
          @paddle
        </pre>
      </section>

      <div className="flex flex-col gap-14">
        {[...groups].map(([category, groupItems]) => (
          <section key={category}>
            <h2 className="flex items-baseline gap-3 border-b border-brand-line pb-3">
              <span className="text-xl font-semibold capitalize">{category}</span>
              <span className="font-brand-mono text-xs text-brand-muted">
                {String(groupItems.length).padStart(2, "0")}
              </span>
            </h2>
            <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {groupItems.map((item) => (
                <ItemCard key={item.name} item={item} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
