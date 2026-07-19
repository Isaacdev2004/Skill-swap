# SkillSwap

Peer-to-peer skill exchange platform — teach what you know, learn what you need.

**Live app:** https://skill-swap-api-server.vercel.app/  
**Live API:** https://skill-swap-q5p5.onrender.com/api/v1  
**API docs:** https://skill-swap-q5p5.onrender.com/api/docs

---

## Project structure

```
Skill-Swap/
├── artifacts/
│   └── skillswap/          # Frontend (React + Vite + TypeScript)
├── backend/                # Backend (Express + MongoDB + Socket.IO)
│   ├── src/
│   │   ├── modules/        # Feature modules (auth, users, chat, admin, …)
│   │   ├── seed/           # Database seed script + demo data
│   │   ├── socket/         # Socket.IO realtime handlers
│   │   └── database/       # MongoDB connection
│   ├── docs/               # Backend deployment notes
│   └── README.md           # Backend setup & API overview
├── docs/
│   └── DEPLOYMENT.md       # Full Vercel + Render deployment guide
├── render.yaml             # Render service blueprint
└── vercel.json             # Vercel frontend config
```

---

## Tech stack

| Layer | Stack |
|-------|-------|
| Frontend | React 18, Vite, TypeScript, Tailwind, Zustand, TanStack Query |
| Backend | Node.js 20, Express 5, Mongoose, JWT, Socket.IO |
| Database | MongoDB Atlas |
| Deploy | Vercel (frontend), Render (backend) |

---

## Local setup

### Prerequisites

- Node.js 20+
- pnpm 10+
- MongoDB (local or Atlas URI)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set MONGODB_URI and JWT secrets (32+ chars each)
npm install
npm run seed    # Creates demo users, skills, sessions, messages, admin
npm run dev     # http://localhost:5000
```

### 3. Frontend

```bash
cd artifacts/skillswap
# Create .env if needed:
# VITE_API_URL=http://localhost:5000/api/v1
pnpm run dev    # http://localhost:5173
```

---

## Database schema

MongoDB collections are defined as Mongoose models under `backend/src/modules/`:

| Model | Path |
|-------|------|
| User | `modules/users/models/user.model.ts` |
| Skill / Category / UserSkill | `modules/skills/models/` |
| SwapRequest | `modules/swapRequests/models/swapRequest.model.ts` |
| Session | `modules/sessions/models/session.model.ts` |
| Conversation / Message | `modules/chat/models/chat.model.ts` |
| Notification | `modules/notifications/models/notification.model.ts` |
| Review | `modules/reviews/models/review.model.ts` |
| Badge | `modules/badges/models/badge.model.ts` |
| Report | `modules/admin/models/admin.model.ts` |

Run `npm run seed` in `backend/` to populate all collections with demo data.

---

## Seed & demo accounts

After seeding (`cd backend && npm run seed`):

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@skillswap.app` | `Admin123!@#` |
| Demo user | `alex.smith0@skillswap.test` | `Password123!` |
| Demo user | `jordan.johnson1@skillswap.test` | `Password123!` |

Seed creates 20 users, 80 skills, 8 categories, swap requests, sessions, chat messages, notifications, badges, and one admin report.

**Production:** Run the seed once against your Atlas database via Render Shell:

```bash
cd backend && npm run seed
```

---

## Deployment

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for step-by-step Vercel + Render instructions.

**Required Render env vars:** `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `COOKIE_SECRET`, `ALLOWED_ORIGINS`, `FRONTEND_URL`

**Required Vercel env var:** `VITE_API_URL=https://YOUR-API.onrender.com/api/v1`

---

## Integration status (live app)

| Feature | Status |
|---------|--------|
| Auth (register / login / JWT) | ✅ Connected to live API |
| Dashboard layout after login | ✅ Fixed & deployed |
| Marketplace, matches, scheduler, chat UI, admin screens | UI complete; uses demo/mock data in frontend (backend APIs exist) |
| Realtime chat (Socket.IO) | ✅ Backend deployed on Render; frontend socket client integration in progress |

---

## Source repository

GitHub: https://github.com/Isaacdev2004/Skill-swap

Clone:

```bash
git clone https://github.com/Isaacdev2004/Skill-swap.git
cd Skill-swap
pnpm install
```
