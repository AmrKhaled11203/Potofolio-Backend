import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";

import notFound from "./middleware/notFoundHandler.js";
import errorHandler from "./middleware/errorHandler.js";

import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(process.cwd(), "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();

app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan("dev"));
app.use("/uploads", express.static(uploadDir));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the portoflio API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/skills", skillRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
