"use client"

import * as React from "react"
import { Monitor, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

type ThemePreference = "light" | "dark" | "system"

const STORAGE_KEY = "paddle-ui-preview-theme"
const DARK_QUERY = "(prefers-color-scheme: dark)"

/** Runs before hydration so the first paint already has the right theme. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}")||"system";var d=t==="dark"||(t==="system"&&matchMedia("${DARK_QUERY}").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})()`

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "light" || stored === "dark") return stored
  } catch {
    // Storage blocked (e.g. private mode): fall back to the OS setting.
  }
  return "system"
}

function applyPreference(preference: ThemePreference) {
  const dark = preference === "dark" || (preference === "system" && matchMedia(DARK_QUERY).matches)
  document.documentElement.classList.toggle("dark", dark)
}

function subscribeToHtmlClass(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => observer.disconnect()
}

/** Resolved theme, for components like Paddle checkout that take an explicit `theme` prop. */
export function useResolvedTheme(): "light" | "dark" {
  return React.useSyncExternalStore(
    subscribeToHtmlClass,
    () => (document.documentElement.classList.contains("dark") ? "dark" : "light"),
    () => "light"
  )
}

const options: { value: ThemePreference; label: string; icon: React.ElementType }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

export function ThemeToggle() {
  const [preference, setPreference] = React.useState<ThemePreference>("system")

  React.useEffect(() => setPreference(readPreference()), [])

  React.useEffect(() => {
    applyPreference(preference)
    if (preference !== "system") return
    const media = matchMedia(DARK_QUERY)
    const onChange = () => applyPreference("system")
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [preference])

  function select(value: ThemePreference) {
    setPreference(value)
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // Storage blocked: the choice still applies for this page view.
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="flex rounded-full border border-brand-line bg-brand-surface p-0.5"
    >
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          role="radio"
          aria-checked={preference === value}
          aria-label={label}
          title={label}
          onClick={() => select(value)}
          className={cn(
            "rounded-full p-1.5 text-brand-muted transition-colors hover:text-brand-ink",
            preference === value && "bg-brand-ink text-brand-surface hover:text-brand-surface"
          )}
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  )
}
