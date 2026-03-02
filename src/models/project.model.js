import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // This will store the Cloudinary URL
  cloudinaryId: { type: String }, // This stores the ID needed for deletion
  technologies: [String],
  liveLink: String,
  githubLink: String,
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;
