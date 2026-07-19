# Deployment Guide

## MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user and whitelist your IP (or `0.0.0.0/0` for cloud deploys)
3. Copy the connection string to `MONGODB_URI`

## Railway

1. Connect your GitHub repository
2. Set root directory to `backend`
3. Add environment variables from `.env.example`
4. Railway auto-detects the Dockerfile

## Render

1. Create a new Web Service
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Add MongoDB Atlas URI and JWT secrets

## Docker

```bash
docker compose up --build
```

## Required Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Min 32 characters |
| `JWT_REFRESH_SECRET` | Min 32 characters |
| `COOKIE_SECRET` | Min 32 characters |
| `ALLOWED_ORIGINS` | Comma-separated frontend URLs |

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets (32+ chars)
- [ ] Configure `ALLOWED_ORIGINS` to your frontend domain
- [ ] Enable Redis (`REDIS_ENABLED=true`) for caching
- [ ] Configure SMTP for email notifications
- [ ] Set up Google OAuth client ID
- [ ] Run `npm run seed` once on fresh database
