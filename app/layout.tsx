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
        <header className="sticky top-0 z-40 border-b border-brand-line bg-brand-canvas/85 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3" aria-label="Paddle UI home">
              <PaddleLogo className="h-6 w-auto" />
              <span className="h-5 w-px bg-brand-line" />
              <span className="font-brand-mono text-sm uppercase tracking-wider">UI</span>
              <span className="hidden rounded-full bg-brand-highlight px-2 py-0.5 font-brand-mono text-[11px] uppercase tracking-wider text-brand-highlight-ink sm:inline">
                Preview
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <a
                href="https://developer.paddle.com/sdks/components/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden rounded-md px-3 py-1.5 text-sm text-brand-muted transition-colors hover:text-brand-ink md:inline"
              >
                Docs
              </a>
              <a
                href="https://github.com/PaddleHQ/paddle-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden rounded-md px-3 py-1.5 text-sm text-brand-muted transition-colors hover:text-brand-ink md:inline"
              >
                GitHub
              </a>
              <ThemeToggle />
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
