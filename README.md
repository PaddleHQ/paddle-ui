# Paddle Billing UI components

[Paddle Billing](https://www.paddle.com/billing?utm_source=dx&utm_medium=paddle-ui) is the developer-first merchant of record, designed for modern SaaS, AI, mobile app, and digital product businesses. We take care of payments, tax, subscriptions, and metrics with one unified API that does it all.

This repo contains UI components that you can use to integrate Paddle Billing with your app. Built with [shadcn/ui](https://ui.shadcn.com/) for seamless integration with your existing design system.

> **Important:** These components work with Paddle Billing. They do not support Paddle Classic. To work with Paddle Classic, see: [Paddle Classic API reference](https://developer.paddle.com/classic/api-reference/1384a288aca7a-api-reference?utm_source=dx&utm_medium=paddle-ui)

## Demo

See the components in action: [https://developer.paddle.com/sdks/components/](https://developer.paddle.com/sdks/components/)

## Available components

| Name                                | Type      | Description                                                                                                                                                                                                                                           |
| ----------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@paddle/paddle-helpers`            | Library   | Shared display types, format utilities, and payment method display for Paddle UI components. No SDK dependency — safe to install without `@paddle/paddle-js`.                                                                                         |
| `@paddle/paddle-client`             | Library   | Paddle.js initialization singleton, SDK type re-exports, checkout event mapper, and SDK-layer hooks used by all client-side Paddle blocks.                                                                                                            |
| `@paddle/pricing-select-cards`      | Component | Selectable pricing cards with localized prices from Paddle, available in stacked and grid layouts. Uses RadioGroup for single-plan selection — designed for express checkout flows.                                                                   |
| `@paddle/express-checkout`          | Block     | Mobile-first checkout experience with pricing cards and sheet-style checkout drawer. Automatically resizes based on the height of the checkout.                                                                                                       |
| `@paddle/billing-interval-toggle`   | Component | Segmented control for switching between billing intervals. Renders labels automatically from interval keys (`month` → Monthly, `year` → Annually). Designed for pricing pages and plan selectors.                                                     |
| `@paddle/pricing-cards`             | Component | Responsive pricing tier cards with plan name, localized price, feature list, and per-card CTA. Supports current-plan highlighting and selection state for pricing pages and plan change flows.                                                        |
| `@paddle/pricing-display`           | Block     | Pricing section with localized prices, billing interval toggle, and built-in overlay checkout. Supports current-plan highlighting and plan change selection flows.                                                                                    |
| `@paddle/checkout-summary`          | Component | Order summary for inline checkout: line items, totals, recurring/trial info, and refund policy link. Compliance-ready display for Paddle inline checkout.                                                                                             |
| `@paddle/inline-checkout`           | Block     | Inline checkout block with order summary, Paddle payment frame, and real-time event updates. Supports reactive item changes, plan switching, and quantity updates.                                                                                    |
| `@paddle/subscription-status-card`  | Component | Subscription overview card showing plan details, status, billing cycle, line item breakdown, discount, scheduled changes, and optional action buttons. Supports single and multi-item subscriptions, past-due alerts, and collection mode indicators. |
| `@paddle/subscription-alert`        | Component | Contextual alerts for subscription events: payment failures, scheduled cancellations, pauses, trials. Derives the correct alert from subscription state automatically.                                                                                |
| `@paddle/subscription-payment-card` | Component | Payment method and next billing summary card. Auto-resolves payment method display labels from Paddle type/brand/last4 fields. Shows next payment amount, date, and portal link to update payment details.                                            |
| `@paddle/plan-change-preview`       | Component | Compact plan change summary card with side-by-side plan comparison, proration breakdown, upgrade/downgrade badge, discount, scheduled change warning, and optional confirm/cancel actions.                                                            |
| `@paddle/plan-change-breakdown`     | Component | Detailed financial breakdown of a subscription plan change. Invoice-style view with per-transaction line items, proration periods, tax, credits, and totals for immediate, next, and recurring billing.                                               |

See the live previews and full props reference at [developer.paddle.com/sdks/components/](https://developer.paddle.com/sdks/components/).

## Prerequisites

1. [Next.js](https://nextjs.org/) or other React framework
2. [shadcn/ui](https://ui.shadcn.com/) set up in your project
3. [Paddle Billing account](https://sandbox-login.paddle.com/signup?utm_source=dx&utm_medium=paddle-ui) — sandbox recommended for development

## Installation

### Install the registry

Register the Paddle namespace with the shadcn CLI to install components from the Paddle UI registry using the `@paddle` alias:

```bash
pnpm dlx shadcn@latest registry add @paddle
```

### Install a single component

Use the shadcn CLI to add components to your project. The CLI will:

1. Download the component files to your project
2. Install required dependencies (`@paddle/paddle-js`, etc.)
3. Add any shadcn/ui dependencies (like `card`, `button`, `drawer`)

For example, to add a complete pricing page:

```bash
pnpm dlx shadcn@latest add @paddle/pricing-display
```

## Usage

## Environment variables

Add these to your `.env` file:

```bash
# Required for client-side components
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=your_client_token_here
NEXT_PUBLIC_PADDLE_ENV=sandbox  # or "production"
```

Get your credentials from [Paddle > Developer tools > Authentication](https://sandbox-vendors.paddle.com/authentication-v2).

## Set up components

Some components require price IDs. You can find them in your Paddle dashboard under Catalog > Prices.

Check the documentation for each component for a demo and a list of props.

## Get help

For help with these components, open an issue in this repository.

For help with Paddle Billing, contact the Paddle DX team at `team-dx@paddle.com`.

## Learn more

- [Paddle Billing docs](https://developer.paddle.com/?utm_source=dx&utm_medium=paddle-ui)
- [Paddle.js overview](https://developer.paddle.com/paddlejs/?utm_source=dx&utm_medium=paddle-ui)
- [Paddle API reference](https://developer.paddle.com/api-reference/?utm_source=dx&utm_medium=paddle-ui)
- [Sign up for Paddle Billing](https://sandbox-login.paddle.com/signup?utm_source=dx&utm_medium=paddle-ui)
