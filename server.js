// ✅ This trick works because env.js is evaluated first
// before any other module reads process.env
import "./env.js";             // 👈 FIRST — loads all env vars
import connectDB from "./src/config/db.js";
import app from "./src/app.js";

const start = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV}`);
      console.log(`🔗 ALLOWED_ORIGINS: ${process.env.ALLOWED_ORIGINS}`);
    });
  } catch (error) {
    console.error("❌ Startup Error:", error.message);
    process.exit(1);
  }
};

start();