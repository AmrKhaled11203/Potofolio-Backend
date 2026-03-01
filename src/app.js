import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";

// Middleware Imports
import notFound from "./middleware/notFoundHandler.js";
import errorHandler from "./middleware/errorHandler.js";

// ─── Directory Setup ─────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ─── App Initialization ───────────────────────────────────────────────────────
const app = express();

/**
 * ✅ TRUST PROXY
 * Required for Railway/Heroku. Ensures req.ip is the user's IP, 
 * not the load balancer's IP. This is critical for Rate Limiting.
 */
app.set("trust proxy", 1);

// ─── CORS Configuration ───────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000"]; // Default to local dev if env var is missing

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

/**
 * ✅ CORS MIDDLEWARE (Must be at the top)
 * This handles the OPTIONS preflight request before any other middleware
 * like Helmet or Rate Limit can interfere.
 */
app.use(cors(corsOptions));

/**
 * ✅ HELMET (Security Headers)
 * Configured to allow cross-origin resource sharing for images/assets.
 */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

// ─── Logging ──────────────────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/**
 * ✅ RATE LIMITING
 * Prevents brute force. We skip OPTIONS requests so preflights 
 * don't count against the user's limit.
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS", // 👈 Don't limit preflight requests
  message: {
    success: false,
    error: "Too many requests. Please try again later.",
  },
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
    env: process.env.NODE_ENV 
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