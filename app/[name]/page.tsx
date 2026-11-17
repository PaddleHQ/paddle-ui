import Link from "next/link"
import { notFound } from "next/navigation"
import registry from "@/registry.json"
import { previews } from "@/previews"

export function generateStaticParams() {
  return Object.keys(previews).map((name) => ({ name }))
}

export default async function PreviewPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const item = registry.items.find((i) => i.name === name)
  const Preview = previews[name]
  if (!item || !Preview) notFound()

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← All components
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">{item.title}</h1>
      <p className="mt-2 text-muted-foreground">{item.description}</p>
      <pre className="mt-4 overflow-x-auto rounded-md bg-muted px-3 py-2 text-sm">
        pnpm dlx shadcn@latest add http://localhost:3000/r/{item.name}.json
      </pre>
      <div className="mt-10 flex flex-col gap-12">
        <Preview />
      </div>
    </main>
  )
}
