import type { Metadata } from "next"
import "@/registry/new-york/globals.css"

export const metadata: Metadata = {
  title: "Paddle UI preview",
  description: "Local preview of the Paddle UI shadcn registry components.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  )
}
