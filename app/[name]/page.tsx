import Link from "next/link"
import { notFound } from "next/navigation"
import registry from "@/registry.json"
import { previews } from "@/previews"

type RegistryItem = (typeof registry.items)[number] & { categories?: string[] }

export function generateStaticParams() {
  return Object.keys(previews).map((name) => ({ name }))
}

export default async function PreviewPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const item = (registry.items as RegistryItem[]).find((i) => i.name === name)
  const entry = previews[name]
  if (!item || !entry) notFound()
  const { Preview } = entry

  return (
    <main className="px-6 pb-20">
      <section className="border-b border-brand-line py-10 sm:py-14">
        <Link
          href="/"
          className="font-brand-mono text-xs uppercase tracking-widest text-brand-muted transition-colors hover:text-brand-ink"
        >
          ← Components{item.categories?.[0] && ` / ${item.categories[0]}`}
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{item.title}</h1>
          <span className="rounded-full border border-brand-line px-2.5 py-0.5 font-brand-mono text-[11px] uppercase tracking-wider text-brand-muted">
            {item.type.replace("registry:", "")}
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-brand-muted">{item.description}</p>
        <div className="mt-6 flex flex-col gap-2">
          <pre className="max-w-full self-start overflow-x-auto rounded-lg bg-brand-ink px-4 py-3 font-brand-mono text-sm text-brand-surface">
            <span className="text-brand-highlight">$</span> pnpm dlx shadcn@latest add @paddle/
            {item.name}
          </pre>
          <p className="font-brand-mono text-xs text-brand-muted">
            Local build: pnpm dlx shadcn@latest add http://localhost:3000/r/{item.name}.json
          </p>
        </div>
      </section>
      <div className="mt-10 flex flex-col gap-12">
        <Preview />
      </div>
    </main>
  )
}
