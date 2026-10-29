import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    include: ["registry/**/*.test.ts"],
    // Date formatting depends on the runtime timezone; pin it so results match everywhere
    env: { TZ: "UTC" },
  },
})
