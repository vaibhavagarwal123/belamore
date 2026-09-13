# Belamore — Setup, Deployment & Admin Guide

This document covers everything needed to run Belamore locally, deploy it to production, connect
real payment/email/analytics accounts, and manage the store day-to-day through the admin panel.

---

## 1. What's included

| Area | Status |
|---|---|
| Immersive homepage (marble palace hero, animated category "doors") | ✅ Built |
| Product catalogue (8 categories, 46 products, real prices from your catalogue PDF) | ✅ Built, editable in admin |
| Product pages — images, description, price, stock, care instructions | ✅ Built |
| Cart & checkout | ✅ Built |
| Payments — Razorpay (UPI/cards/netbanking), Stripe (international cards), Cash on Delivery | ✅ Built — add your API keys to activate Razorpay/Stripe |
| Discount codes (% or ₹ off, min order, usage limits, expiry) | ✅ Built, manage in admin |
| Gift cards (admin-issued, redeemable at checkout) | ✅ Built — see note in §7 |
| Customer accounts (signup/login/order history) | ✅ Built |
| Admin panel (password-protected, separate from customer accounts) | ✅ Built |
| Sales dashboard (day/week/month/year revenue & orders) | ✅ Built |
| Blog / Journal, Testimonials, editable homepage & about copy | ✅ Built |
| Contact form, Privacy Policy, Terms of Service | ✅ Built |
| Newsletter signup + CSV export + optional Mailchimp sync | ✅ Built |
| SEO — metadata, sitemap.xml, robots.txt, product structured data | ✅ Built |
| Google Analytics, Tawk.to live chat | ✅ Built — add your IDs to activate |
| Shipping/courier API integration (Shiprocket, Delhivery, etc.) | ⚠️ Not built — flat-rate shipping only (see §9) |
| Paytm / PayU / PayPal | ⚠️ Not built — Razorpay covers UPI; adding another gateway follows the same pattern as Stripe (see §6) |
| Automated abandoned-cart emails | ⚠️ Not built — abandoned orders are visible in admin; see §10 for a manual/semi-automated workaround |

---

## 2. Local development

```bash
npm install
cp .env.example .env
# Open .env and set SESSION_SECRET to a random string:
#   openssl rand -base64 48
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. Go to `/admin/setup` once to create your admin login.

---

## 3. Environment variables

All variables live in `.env` (never commit this file — it's git-ignored). See `.env.example`
for the full list with comments. The important ones:

- `DATABASE_URL` — database connection string (SQLite locally, Postgres in production)
- `NEXT_PUBLIC_SITE_URL` — your live domain, e.g. `https://belamoregifts.com` (used in emails, payment redirect URLs, sitemap)
- `SESSION_SECRET` — random string signing admin/customer login cookies
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET`
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_FROM`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_TAWKTO_WIDGET_ID`
- `MAILCHIMP_API_KEY` / `MAILCHIMP_SERVER_PREFIX` / `MAILCHIMP_AUDIENCE_ID`

Every feature that depends on one of these degrades gracefully when the variable is empty
(e.g. Cash on Delivery still works with no payment keys set at all; password reset logs a link
to the server console instead of emailing if SMTP isn't configured).

---

## 4. Deploying to production

**Recommended: Vercel** (built by the same team as Next.js, zero-config for this stack).

1. Push this repository to GitHub (already done if you're reading this in your repo).
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. **Switch the database to Postgres** — SQLite's local file doesn't persist reliably on
   serverless hosting. Create a free Postgres database at
   [Neon](https://neon.tech) or [Supabase](https://supabase.com), then:
   - In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
   - Set `DATABASE_URL` in Vercel's environment variables to the Postgres connection string.
   - Run `npx prisma db push` once (locally, pointed at the new `DATABASE_URL`, or via a Vercel
     deploy hook) and `npm run db:seed` to load the catalogue.
4. Add all the environment variables from §3 in Vercel's project settings.
5. Set `NEXT_PUBLIC_SITE_URL` to your real domain.
6. Deploy. Visit `/admin/setup` on the live site once to create your admin login.

**Image uploads note:** the admin panel's "Upload an image" button saves files to the server's
local disk (`public/uploads`). On Vercel (serverless), this storage is **not persistent** across
deployments. For production, either (a) keep using image URLs already in `/public/products`, or
your own external image links, instead of the upload button, or (b) connect a storage bucket
(Cloudflare R2, AWS S3, Vercel Blob) — ask your developer to swap the upload route
(`src/app/api/admin/upload/route.ts`) to write there instead of the local filesystem. If you
deploy to a regular VPS/Docker host instead of serverless, local uploads persist fine as-is.

---

## 5. Admin panel — first login & password reset

- **First time:** visit `/admin/setup`. This page only works once — after an admin account
  exists it redirects to `/admin/login`.
- **Forgot password:** go to `/admin/login` → "Forgot your password?" → enter your email.
  - If SMTP is configured (§3), you'll receive a reset link by email.
  - If not, the reset link is printed to the server logs — ask whoever manages hosting to check
    them, or use the command-line fallback below.
- **Command-line reset** (always works, useful if you're fully locked out):
  ```bash
  npm run admin:reset-password -- youremail@example.com NewPassword123
  ```
- **Change password while logged in:** `/admin/settings`.

Only one admin account is expected (per the brief: you and your wife share this single login).
If you'd like a second, separate login, ask your developer — the schema supports multiple
`AdminUser` rows already, there's just no "invite a second admin" screen built.

---

## 6. Connecting payment gateways

### Razorpay (recommended for India — covers UPI, cards, netbanking, wallets)

1. Create an account at [razorpay.com](https://razorpay.com) and complete KYC.
2. Dashboard → Settings → API Keys → generate a key pair.
3. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in your environment.
4. Dashboard → Settings → Webhooks → add `https://yourdomain.com/api/webhooks/razorpay`,
   subscribe to `payment.captured`, and set `RAZORPAY_WEBHOOK_SECRET` to the secret shown.
5. Redeploy. The Razorpay option now appears at checkout automatically.

### Stripe (international cards)

1. Create an account at [stripe.com](https://stripe.com).
2. Dashboard → Developers → API keys → copy the secret key into `STRIPE_SECRET_KEY`, and the
   publishable key into `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Dashboard → Developers → Webhooks → add `https://yourdomain.com/api/webhooks/stripe`,
   subscribe to `checkout.session.completed`, set `STRIPE_WEBHOOK_SECRET`.
4. Redeploy.

### Adding PayPal, PayU, or Paytm

Not built in, but the codebase follows one consistent pattern for every gateway (see
`src/lib/payments/`, `src/app/api/payments/`, and `src/components/checkout/checkout-form.tsx`).
A developer can add another gateway by copying the Stripe integration as a template — typically
half a day of work per gateway.

---

## 7. Discounts & gift cards

**Discount codes** — `/admin/discounts`. Set a code, percentage or fixed ₹ amount off, a minimum
order value, an optional usage limit and expiry date. Customers enter the code at checkout.

**Gift cards** — `/admin/gift-cards`. Issue a gift card for a chosen ₹ value (optionally tied to
a recipient email); the system generates a redeemable code. Customers enter it at checkout and
the balance is deducted from their order total (a card can be used across multiple orders until
its balance runs out). Note: in this version gift cards are **issued by you** (e.g. for customer
goodwill, manual sales, or corporate gifting) rather than sold as a product customers add to
their own cart — if you'd like customers to purchase gift cards directly on the site, that's a
natural next feature to add (it would be modeled as a special product).

**Bulk/corporate pricing** (10–49 units 5% off, 50–199 units 10% off, 200+ units 15% off, as in
your original catalogue) isn't automatic per-line-item — create a discount code per tier (e.g.
`BULK10`, `BULK15`) and share it with corporate clients, or ask your developer to automate
quantity-based tiers if you expect frequent bulk orders.

---

## 8. Day-to-day store management

- **Add a product:** `/admin/products` → "+ Add Product". Fill in name, category, SKU, price,
  stock, description and care instructions. Add image paths (one per line — use existing
  `/products/img-XXX.jpg` files, or upload a new photo with the "Upload an image" button) and,
  if the product comes in sizes/variants, add them with the "+ Add variant" button.
- **Add/edit a category:** `/admin/categories`.
- **Manage orders:** `/admin/orders` — filter by status, open an order to see items, shipping
  address and payment reference, and update its status (this also restocks items automatically
  if you cancel an order).
- **Edit homepage/about copy:** `/admin/content` — no code or redeploy needed.
- **Blog posts & testimonials:** `/admin/blog` and `/admin/testimonials`.
- **Newsletter subscribers:** `/admin/newsletter` — export to CSV any time.
- **Sales dashboard:** `/admin` — toggle Day / Week / Month / Year on the chart; low-stock
  products are flagged automatically (≤5 units).

---

## 9. Shipping

Checkout currently uses a simple flat rate (₹99, free above ₹1,999 — edit these in
`src/lib/constants.ts`). Real courier integration (Shiprocket, Delhivery, India Post, DHL for
international) requires an account with that provider and typically a small amount of custom
code to fetch live rates and generate shipping labels/AWB numbers from the admin order screen.
This is a natural next step once you've chosen a courier partner.

---

## 10. Abandoned cart follow-up (manual, for now)

When a customer starts checkout with Razorpay/Stripe but doesn't complete payment, their order
is saved with status **"Awaiting payment"** and is visible in `/admin/orders`. There's no
automated reminder email sequence built yet. As a manual workaround: check that filter
periodically and follow up by phone/email/WhatsApp using the contact details on the order. To
automate this properly, connect an email platform like Klaviyo or Mailchimp's abandoned-cart
automation (needs their tracking snippet + an API call from `src/app/api/checkout/route.ts` when
an order is created) — worth adding once order volume justifies it.

---

## 11. SEO & analytics setup

1. **Google Analytics:** create a GA4 property, copy the Measurement ID (`G-XXXXXXX`) into
   `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
2. **Google Search Console:** verify your domain, then submit `https://yourdomain.com/sitemap.xml`
   (generated automatically and always up to date).
3. **Live chat:** create a free [Tawk.to](https://tawk.to) account, copy your Widget ID into
   `NEXT_PUBLIC_TAWKTO_WIDGET_ID`.
4. **Email marketing:** create a Mailchimp audience, set `MAILCHIMP_API_KEY`,
   `MAILCHIMP_SERVER_PREFIX` (e.g. `us21`) and `MAILCHIMP_AUDIENCE_ID` — newsletter signups then
   sync automatically in addition to being stored locally.

---

## 12. Legal pages

`/privacy-policy` and `/terms-of-service` contain starter policies covering the basics
(payments, handcrafted-product variation, returns, bulk pricing). Please have a lawyer review
and tailor them before launch, especially if you'll ship internationally.

---

## 13. Getting help

The codebase is organized by feature (see the Project Structure section in `README.md`), with
plain TypeScript and no exotic tooling — any Next.js developer can pick it up. If something
breaks, check:
- `npm run build` — catches most configuration issues.
- Server logs — printed to your hosting provider's dashboard (or terminal locally).
- The `.env.example` file — a missing or malformed environment variable is the most common cause
  of a feature silently not working (e.g. payments not appearing at checkout).
