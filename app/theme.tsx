"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"

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

const subscribeNever = () => () => {}

/**
 * False during server render and hydration, true after. `useResolvedTheme` reports
 * "light" until hydration ends, so gate anything that reads the theme once on mount.
 */
export function useHydrated(): boolean {
  return React.useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )
}

/** Single light/dark toggle, like the docs header (Header.astro theme button). */
export function ThemeToggle() {
  const theme = useResolvedTheme()

  // Until a choice is stored, keep following the OS setting.
  React.useEffect(() => {
    if (readPreference() !== "system") return
    const media = matchMedia(DARK_QUERY)
    const onChange = () => {
      if (readPreference() === "system") applyPreference("system")
    }
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  function toggle() {
    const next: ThemePreference = theme === "dark" ? "light" : "dark"
    applyPreference(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage blocked: the choice still applies for this page view.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      title="Toggle theme"
      className="inline-flex size-9 items-center justify-center rounded-md transition-colors hover:bg-brand-accent"
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </button>
  )
}
