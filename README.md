# Belamore — Marble Gifting E-Commerce Platform

A full e-commerce website for **Belamore**, built as an immersive "marble palace" experience:
visitors enter through a marble gate, choose a door into a collection room, and browse
handcrafted marble gifts with clear pricing and easy checkout — all in Belamore's beige,
white and pastel brand palette with gold infinity-symbol accents.

Built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma**. Includes a full
storefront, cart & checkout with Razorpay/Stripe/COD, customer accounts, and a password-protected
admin panel for managing products, orders, discounts, gift cards, blog content and site copy.

**Start here:** [`SETUP.md`](./SETUP.md) has the full setup, deployment, and admin usage guide.

## Quick Start (local development)

```bash
npm install
cp .env.example .env          # then edit .env — see SETUP.md
npm run db:push               # create the local database
npm run db:seed               # load the Belamore catalogue (46 products, 8 categories)
npm run dev
```

Visit `http://localhost:3000`. Go to `http://localhost:3000/admin/setup` to create the admin
account (name, email, password) — this only works once; after that it redirects to
`/admin/login`.

## Tech Stack

- **Framework:** Next.js 14 (App Router), TypeScript, React 18
- **Styling:** Tailwind CSS, Framer Motion (page/scroll animations)
- **Database:** Prisma ORM — SQLite for local dev, swap to Postgres for production (see SETUP.md)
- **Auth:** Custom, cookie-based sessions (bcrypt + signed JWT) — no third-party auth dependency
- **Payments:** Razorpay (UPI/cards/netbanking) and Stripe (international cards), plus Cash on
  Delivery — all optional and enabled by adding API keys
- **Charts:** Recharts (admin sales dashboard)
- **State:** Zustand (shopping cart, persisted to localStorage)

## Project Structure

```
prisma/schema.prisma      Database schema
prisma/seed.ts             Seed script — the real Belamore catalogue, from the product PDF
src/app/(site)/            Public storefront (home, collections, products, cart, checkout, blog...)
src/app/admin/(auth)/      Admin login / first-time setup / password reset
src/app/admin/(dashboard)/ Protected admin panel (products, orders, discounts, content...)
src/app/api/               API routes (checkout, payments, webhooks, auth, newsletter...)
src/components/            UI components, organized by area (home/, product/, admin/, checkout/...)
src/lib/                   Server logic: db client, auth, payments, discounts, gift cards...
public/products/           Product photography (extracted from the Belamore catalogue)
scripts/reset-admin-password.ts   CLI fallback to reset the admin password
```

## What's real vs. what needs your accounts

This is a fully working application — not a mockup. Product Browse, cart, checkout (COD out of
the box), accounts, and the entire admin panel work end-to-end against a real database. The
pieces that need **your own** third-party accounts and API keys (payment gateways, email
sending, analytics, live chat) are wired up and ready — see the "Going Live Checklist" in
`SETUP.md` for exactly what to add and where.
