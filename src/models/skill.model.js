import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: "Frontend" }, // Frontend, Backend, Tools, etc.
    level: { type: Number, default: 80 }, // Percentage level
    icon: { type: String }, // Path to icon image
  },
  { timestamps: true },
);

export default mongoose.model("Skill", skillSchema);
