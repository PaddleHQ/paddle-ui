import Link from "next/link"
import registry from "@/registry.json"
import { previews } from "@/previews"

export default function Home() {
  const items = registry.items.filter((item) => item.type !== "registry:lib")

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Paddle UI registry</h1>
      <p className="mt-2 text-muted-foreground">
        Local previews of every component and block in <code>registry.json</code>. Registry JSON is
        served from <code>/r/&lt;name&gt;.json</code> after <code>pnpm registry:build</code>.
      </p>
      <ul className="mt-8 divide-y rounded-lg border">
        {items.map((item) => (
          <li key={item.name}>
            <Link
              href={`/${item.name}`}
              className="flex flex-col gap-1 p-4 transition-colors hover:bg-muted/50"
            >
              <span className="flex items-center gap-2 font-medium">
                {item.title}
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                  {item.type.replace("registry:", "")}
                </span>
                {!previews[item.name] && (
                  <span className="text-xs text-destructive">no preview</span>
                )}
              </span>
              <span className="text-sm text-muted-foreground">{item.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
