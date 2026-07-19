# SkillSwap Backend

Production-ready Node.js backend for the SkillSwap peer-to-peer skill exchange platform.

## Stack

- **Runtime:** Node.js 20+
- **Framework:** Express 5
- **Database:** MongoDB + Mongoose
- **Realtime:** Socket.IO
- **Auth:** JWT + Refresh Tokens + Google OAuth
- **Validation:** Zod
- **Cache:** Redis (optional)
- **Email:** Nodemailer
- **Docs:** Swagger/OpenAPI

## Quick Start

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### With Docker

```bash
docker compose up --build
```

## Seed Data

```bash
npm run seed
```

Creates 20 users, 80 skills, categories, swap requests, sessions, messages, notifications, badges, and an admin user.

**Admin credentials** (from `.env`):
- Email: `admin@skillswap.app`
- Password: `Admin123!@#`

## API Endpoints

| Module | Base Path |
|--------|-----------|
| Auth | `/api/v1/auth` |
| Users | `/api/v1/users` |
| Skills | `/api/v1/skills` |
| Marketplace | `/api/v1/marketplace` |
| Matches | `/api/v1/matches` |
| Swap Requests | `/api/v1/swap-requests` |
| Sessions | `/api/v1/sessions` |
| Chat | `/api/v1/chat` |
| Notifications | `/api/v1/notifications` |
| Reviews | `/api/v1/reviews` |
| Badges | `/api/v1/badges` |
| Admin | `/api/v1/admin` |

**Swagger UI:** `http://localhost:5000/api/docs`

## Architecture

Feature-based modular architecture:

```
backend/src/
├── config/          # Environment, constants, Swagger
├── database/        # MongoDB + Redis connections
├── middlewares/     # Auth, RBAC, validation, errors
├── modules/         # Feature modules (auth, users, skills, ...)
├── socket/          # Socket.IO handlers
├── emails/          # Nodemailer service
├── cron/            # Scheduled jobs
├── seed/            # Database seeding
└── routes/          # API route aggregator
```

Each module contains:
- Controller, Service, Repository, Model, Routes, Validator, DTO

## Environment Variables

See `.env.example` for all required variables.

## Testing

```bash
npm test
```

## Deployment

Supports Docker, Railway, Render, and MongoDB Atlas. See `docs/DEPLOYMENT.md`.

## Out of Scope (MVP)

- Payments / Stripe / Wallet
- Image uploads / Cloudinary
- Video hosting / WebRTC / Meet link generation

Google Meet links are pasted as normal chat messages.
