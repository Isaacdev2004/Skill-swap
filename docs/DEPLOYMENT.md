# Deploy SkillSwap — Vercel (Frontend) + Render (Backend)

## Prerequisites

1. **MongoDB Atlas** free cluster — [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **GitHub repo** connected to both platforms
3. **Vercel** account — [vercel.com](https://vercel.com)
4. **Render** account — [render.com](https://render.com)

---

## Step 1 — Deploy backend to Render

### Option A: Blueprint (recommended)

1. Go to [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**
2. Connect repo: `Isaacdev2004/Skill-swap`
3. Render reads `render.yaml` at repo root
4. Set these **secret** env vars when prompted:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your Atlas connection string |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` (update after Vercel deploy) |
| `FRONTEND_URL` | `https://your-app.vercel.app` |

5. Deploy and copy your API URL, e.g. `https://skillswap-api.onrender.com`

### Option B: Manual Web Service

**Important:** If build logs show `pnpm run build` from the repo root, your Root Directory is wrong. Render must build the `backend` folder only.

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/api/v1/health` |

Do **not** use the default monorepo build (`pnpm install && pnpm run build` at repo root).

**Required env vars:**

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_ACCESS_SECRET=<32+ random chars>
JWT_REFRESH_SECRET=<32+ random chars>
COOKIE_SECRET=<32+ random chars>
ALLOWED_ORIGINS=https://your-app.vercel.app
FRONTEND_URL=https://your-app.vercel.app
REDIS_ENABLED=false
USE_MEMORY_DB=false
```

Verify: `https://YOUR-API.onrender.com/api/v1/health`

### Seed production database (once)

In Render Shell or locally with production `MONGODB_URI`:

```bash
cd backend && npm run seed
```

---

## Step 2 — Deploy frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/new) → Import `Isaacdev2004/Skill-swap`
2. Use these settings (or rely on root `vercel.json`):

| Setting | Value |
|---------|-------|
| Framework Preset | Vite |
| Install Command | `pnpm install` |
| Build Command | `pnpm --filter @workspace/skillswap run build` |
| Output Directory | `artifacts/skillswap/dist/public` |

3. **Environment variables:**

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://YOUR-API.onrender.com/api/v1` |

4. Deploy

---

## Step 3 — Link frontend ↔ backend

After Vercel gives you a URL (e.g. `https://skill-swap.vercel.app`):

1. In **Render** → your service → **Environment**:
   - `ALLOWED_ORIGINS` = `https://skill-swap.vercel.app`
   - `FRONTEND_URL` = `https://skill-swap.vercel.app`
2. Redeploy Render service

---

## Architecture

```
Browser (Vercel)
  └── VITE_API_URL → Render API (/api/v1)
                         └── MongoDB Atlas
```

- Auth uses **JWT** (Bearer header) + httpOnly refresh cookies on the API domain
- CORS allows your Vercel origin via `ALLOWED_ORIGINS`

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ERR_CONNECTION_REFUSED` on API | Render service sleeping (free tier) — wait ~30s on first request |
| CORS errors | Add exact Vercel URL to `ALLOWED_ORIGINS` (no trailing slash) |
| Login fails | Check `MONGODB_URI`, run `npm run seed`, verify `/api/v1/health` |
| Build fails on Vercel | Ensure `pnpm install` runs from repo root (monorepo) |
| Build fails on Render | Check logs; ensure `npm run build` completes (uses `tsc-alias`) |

---

## Custom domains

- **Vercel:** Project Settings → Domains
- **Render:** Service Settings → Custom Domain
- Update `ALLOWED_ORIGINS` and `FRONTEND_URL` with your custom domains
