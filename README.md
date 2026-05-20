# UW Marketplace

A buy-and-sell marketplace exclusively for University of Waterloo students. List items, browse by category, and message sellers in real time.

**Restricted to `@uwaterloo.ca` email addresses.**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS v4 |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL 16 |
| Real-time | Socket.io |
| Images | Cloudinary |
| Email | Resend |
| Monorepo | Turborepo + npm workspaces |

---

## Quick Start

### Prerequisites

- [Node.js 20+](https://nodejs.org) — check with `node -v`
- [Docker Desktop](https://www.docker.com/products/docker-desktop) — for local Postgres

### 1. Clone and install

```bash
git clone https://github.com/Varaunight/UW-Marketplace.git
cd UW-Marketplace
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the required values:

| Variable | Where to get it |
|----------|----------------|
| `JWT_SECRET` | Run: `openssl rand -hex 64` |
| `JWT_REFRESH_SECRET` | Run: `openssl rand -hex 64` |
| `NEXTAUTH_SECRET` | Run: `openssl rand -hex 64` |
| `CLOUDINARY_*` | [cloudinary.com](https://cloudinary.com) → Dashboard |
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys |

Then create the Next.js local env file:

```bash
cp apps/web/.env.local.example apps/web/.env.local
```

Fill in `apps/web/.env.local` with the same `NEXTAUTH_*` values from `.env`.

> **Note:** In development (`NODE_ENV=development`), email verification is skipped and accounts are auto-verified on sign-up.

### 3. Start the database

```bash
docker compose up -d
```

### 4. Run migrations

```bash
npm run migrate --workspace=apps/api
```

### 5. (Optional) Seed test data

Creates a test account (`testuser@uwaterloo.ca` / `Password123!`) with 20 sample listings.

```bash
npm run seed --workspace=apps/api
```

### 6. Start the app

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Web app | http://localhost:3000 |
| API | http://localhost:4000 |

---

## Project Structure

```
uw-marketplace/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express REST API + Socket.io
└── packages/
    └── shared/       # Shared TypeScript types
```

---

## Key Features

- **@uwaterloo.ca only** — enforced on both client and server
- **Listings** — post items with photos (Cloudinary), browse by category, filter by price, full-text search
- **Real-time messaging** — Socket.io chat between buyer and seller
- **Forgot password** — email reset flow via Resend
- **Categories** — Textbooks, Electronics, Furniture, Clothing, Bikes & Scooters, Miscellaneous

---

## Environment Variables Reference

### Root `.env`

```env
DATABASE_URL=postgresql://uwmarket:uwmarket@localhost:5432/uwmarketplace

JWT_SECRET=
JWT_REFRESH_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RESEND_API_KEY=

WEB_URL=http://localhost:3000
API_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### `apps/web/.env.local`

```env
API_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000

NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```
