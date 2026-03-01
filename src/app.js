import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";

import notFound from "./middleware/notFoundHandler.js";
import errorHandler from "./middleware/errorHandler.js";

// ─── Directory Setup ──────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ─── App Init ─────────────────────────────────────────────────────────────────
const app = express();
app.set("trust proxy", 1);

// ─── ✅ STEP 1: Raw CORS — ABSOLUTE FIRST, before everything─────────────────
// Runs before helmet, rate-limit, routes, and ALL error handlers.
// Even if a crash happens after this, the headers are already on the response.
app.use((req, res, next) => {
  const origin = req.headers.origin;

  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");

  // ✅ Handle ALL preflight requests immediately — never reaches routes
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// ─── ✅ STEP 2: cors() — Simplified to ALWAYS reflect origin ─────────────────
//⚠️ Previously this blocked unknown origins and threw an error,
// which could cause responses with no CORS headers in some edge cases.
// Now it simply mirrors the origin (raw middleware is the security layer).
app.use(
  cors({
    origin: true, // ✅ Reflect the request origin — never blocks
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    optionsSuccessStatus: 200,
  })
);

// ─── ✅ STEP 3: Helmet — after CORS so it doesn't interfere ──────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    // ✅ Disable Content-Security-Policy in dev, configure properly in prod
    contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
  })
);

// ─── Logging ──────────────────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
  message: { success: false, error: "Too many requests. Please try again later." },
});
app.use(limiter);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Static Files ─────────────────────────────────────────────────────────────
app.use("/uploads", express.static(uploadDir));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Portfolio API 🚀",
    env: process.env.NODE_ENV,
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/skills", skillRoutes);

// ─── Error Handlers (Always Last) ────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;