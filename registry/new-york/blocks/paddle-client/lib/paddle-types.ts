/**
 * Convenience re-export barrel for all Paddle types used across blocks.
 * Re-exports SDK types from ./paddle-sdk-types and display contract types
 * from paddle-helpers, so consumers can import from a single location.
 *
 * Canonical sources:
 *   - SDK types and hook API types → ./paddle-sdk-types
 *   - Component display contracts  → @/registry/new-york/blocks/paddle-helpers/lib/paddle-types
 */
export * from "./paddle-sdk-types"
export * from "@/registry/new-york/blocks/paddle-helpers/lib/paddle-types"
