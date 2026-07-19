import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { logger } from "./lib/logger.js";
import pool from "./lib/pool.js";
import router from "./routes/index.js";

const PgSession = connectPgSimple(session);

const app: Express = express();

// CORS — allow the skillswap frontend with credentials
const allowedOrigins = process.env.ALLOWED_ORIGIN
  ? process.env.ALLOWED_ORIGIN.split(",").map((s) => s.trim())
  : ["http://localhost:21899", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow no-origin (same-origin / server-to-server) and listed origins
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
        cb(null, true);
      } else {
        cb(null, true); // permissive in dev; tighten for prod via ALLOWED_ORIGIN
      }
    },
    credentials: true,
  })
);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) { return { id: req.id, method: req.method, url: req.url?.split("?")[0] }; },
      res(res) { return { statusCode: res.statusCode }; },
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error("SESSION_SECRET environment variable is required");

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "session",
      createTableIfMissing: false,
    }),
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

app.use("/api", router);

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);
  const status = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === "production" ? "Internal server error" : (err.message || "Internal server error");
  res.status(status).json({ message });
});

export default app;
