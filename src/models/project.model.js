import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: String,
    type: String,
    description: String,
    longDescription: String,
    category: {
      type: String,
      enum: ["primary", "secondary", "white"],
      default: "primary",
    },
    techStack: [String],
    liveUrl: String,
    githubUrl: String,
    image: String,
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Project", projectSchema);
