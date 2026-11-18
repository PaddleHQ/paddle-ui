import type { Metadata } from "next"
import Link from "next/link"
import { Space_Mono } from "next/font/google"
import "./preview.css"
import { PaddleLogo } from "./paddle-logo"
import { ThemeToggle, themeInitScript } from "./theme"

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
})

export const metadata: Metadata = {
  title: "Paddle UI",
  description: "Local preview of the Paddle UI shadcn registry components.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The init script sets the `dark` class before React hydrates.
    <html lang="en" className={spaceMono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-brand-canvas text-brand-ink antialiased">
        {/* Mirrors the docs header: docs-developer-billing src/components/astro/Header.astro */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-brand-line bg-brand-canvas px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Paddle UI home">
            <PaddleLogo className="h-6 w-auto shrink-0" />
            <span className="text-lg font-medium">UI</span>
            <span className="hidden rounded-md border border-brand-line px-2 py-0.5 font-brand-mono text-[11px] uppercase tracking-wider text-brand-muted sm:inline">
              Preview
            </span>
          </Link>
          <div className="flex items-center gap-1 md:gap-2">
            <a
              href="https://developer.paddle.com/sdks/components/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-9 items-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-brand-accent md:inline-flex"
            >
              Docs
            </a>
            <a
              href="https://github.com/PaddleHQ/paddle-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-9 items-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-brand-accent md:inline-flex"
            >
              GitHub
            </a>
            <ThemeToggle />
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
