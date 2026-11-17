## Contributing

If you've spotted a problem with this package or have a new feature request, please open an issue.

For help with the Paddle API or building your integration, contact our support team at [sellers@paddle.com](mailto:sellers@paddle.com).

### Previewing components locally

```bash
pnpm install
pnpm dev
```

Open [localhost:3000](http://localhost:3000) for a page per registry item, rendered with fixture data from [`previews/`](previews/). When you add an item to `registry.json`, add a preview and register it in [`previews/index.ts`](previews/index.ts).

`express-checkout`, `inline-checkout` and `pricing-display` load Paddle.js. To preview them, copy `.env.example` to `.env.local` and set a sandbox client token and `NEXT_PUBLIC_PREVIEW_PRICE_IDS`.

To test installing an item, run `pnpm registry:build`, then from a separate shadcn project:

```bash
pnpm dlx shadcn@latest add http://localhost:3000/r/<item>.json
```
