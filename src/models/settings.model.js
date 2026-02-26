import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    heroTitle: String,
    heroSubtitle: String,
    aboutText: String,
    resumeUrl: String,
    socialLinks: [
      {
        name: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);