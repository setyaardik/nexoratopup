# NEXORA GAME

Full-stack game top-up platform — Next.js (App Router) + TypeScript + Tailwind CSS v4 + Prisma 7 + PostgreSQL + Tripay + VIPayment H2H.

## Stack notes (read before you dig in)

This was scaffolded with the **latest** toolchain available at build time, which differs from the original Next.js 14 brief in a few load-bearing ways:

- **Next.js 16**, not 14. `middleware.ts` was renamed to `proxy.ts` upstream — this project doesn't use either, auth checks happen per-route via `getServerSession`. Route `params`/`searchParams` are `Promise`s (`await params`) everywhere.
- **Tailwind CSS v4** — no `tailwind.config.ts`. All design tokens (colors, fonts, animations) live in `@theme` at the top of [`src/app/globals.css`](src/app/globals.css).
- **Prisma 7** — the `datasource` block no longer takes a `url`; connection config lives in [`prisma.config.ts`](prisma.config.ts) and `PrismaClient` is constructed with a `@prisma/adapter-pg` driver adapter in [`src/lib/prisma.ts`](src/lib/prisma.ts). The generated client is emitted to `generated/prisma` (gitignored, regenerated via the `postinstall` script).
- **Payment gateway: Tripay only** (the brief mentioned Midtrans/Tripay — Tripay was chosen per project decision, no dual-provider abstraction).

## Getting started

```bash
# 1. Install dependencies (also runs `prisma generate` via postinstall)
npm install

# 2. Environment
cp .env.example .env
# .env already has a working DATABASE_URL for the docker-compose Postgres below
# and a generated NEXTAUTH_SECRET. Fill in VIPAYMENT_*/TRIPAY_* when you have them.

# 3. Start Postgres
docker compose up -d

# 4. Create tables + seed games/products/admin user
npm run db:migrate
npm run db:seed

# 5. Run the dev server
npm run dev
```

Open http://localhost:3000. Admin login is printed by the seed script and defaults to `admin@nexoragame.id` / `Admin123!` (override via `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `.env` before seeding).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / start |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed` | Re-run `prisma/seed.ts` |
| `npm run db:studio` | Open Prisma Studio |

## Plugging in real credentials

Nothing here was tested against live VIPayment or Tripay accounts (none were available while building). Everything is wired end-to-end and degrades gracefully when unconfigured:

- **VIPayment** ([`src/lib/vipayment.ts`](src/lib/vipayment.ts)): set `VIPAYMENT_API_URL`, `VIPAYMENT_API_KEY`, `VIPAYMENT_API_ID`. Signing follows the VIP-Reseller H2H convention (`sign = md5(api_id + api_key)`) — verify field/endpoint names against your actual account docs and adjust `request()` if they differ. Until configured, username validation is skipped (checkout still works) and order fulfillment fails with a clear `failedReason` on the transaction.
- **Tripay** ([`src/lib/payment.ts`](src/lib/payment.ts)): set `TRIPAY_API_KEY`, `TRIPAY_PRIVATE_KEY`, `TRIPAY_MERCHANT_CODE`, `TRIPAY_MODE`. Until configured, the payment method list falls back to a static set (`FALLBACK_PAYMENT_CHANNELS` in [`src/lib/constants.ts`](src/lib/constants.ts)) and checkout returns a 503 with a clear message instead of crashing.
- Register the Tripay callback URL as `{NEXTAUTH_URL}/api/payment/callback` in your Tripay merchant dashboard. It handles both topup transactions (`merchant_ref` = `INV-...`) and wallet deposits (`merchant_ref` = `DEP-...`).
- VIPayment doesn't publicly document a webhook signing scheme, so `/api/transaction/callback` optionally checks a shared-secret `?token=` query param — set `VIPAYMENT_WEBHOOK_TOKEN` if your account supports a custom callback URL with query params.

### Simulating webhooks locally (no real gateway needed)

`POST /api/payment/callback/test` is enabled outside `NODE_ENV=production` and simulates a Tripay callback without a real signature:

```bash
curl -X POST http://localhost:3000/api/payment/callback/test \
  -H "Content-Type: application/json" \
  -d '{"merchantRef": "INV-20260101-12345", "status": "PAID"}'
```

Use the invoice ID returned from `/api/transaction/create` (or `DEP-<depositId>` for a deposit). This flips the transaction to `PAID` and immediately runs the VIPayment fulfillment step — since VIPayment isn't configured by default, expect it to land on `FAILED` with a `failedReason` explaining why. That's the full pipeline working correctly, just without a real upstream to fulfill against.

## Project structure

```
prisma/              schema.prisma, seed.ts (10 games, pricing tiers, admin user)
src/app/              routes (App Router) — pages + api/
src/components/       ui/ (kit), layout/, home/, game/, transaction/, dashboard/, admin/
src/lib/               prisma, vipayment, payment (Tripay), auth, pricing, order-processor,
                       rate-limit, retry, api-response, guards, constants, utils
src/hooks/             useAuth, useTransaction (polls until a transaction reaches a terminal status)
src/types/             DTOs shared between API routes and pages/components
```

## What's covered

- Game catalog (10 seeded games), search + category filters, promo/flash-sale pricing
- Topup flow: dynamic account fields per game → optional username validation → nominal → payment method → checkout
- Tripay-backed checkout (or pay with NEXORA wallet balance) → webhook → automatic VIPayment fulfillment with retry
- Public invoice lookup with a live status tracker (polls until terminal)
- Auth (register/login, bcrypt + NextAuth JWT sessions), member dashboard (stats, history, wallet deposit, profile)
- Admin panel (overview + 7-day chart, product/pricing management, transaction monitoring with retry/refund, site settings)
- Rate limiting on registration, checkout, and deposit creation; Zod validation on every API route

## Known simplifications

- No countdown-to-expiry timer on the pending-payment screen — the schema (kept as specified in the original brief) doesn't store a payment expiry timestamp.
- Three seeded games (Genshin Impact, Honkai: Star Rail, PlayStation) use generated gradient placeholder thumbnails — no matching source image was available among the provided assets.
- WhatsApp notifications (Fonnte) are not wired up — out of scope for this pass, `FONNTE_API_KEY` is reserved in `.env.example` for it.
