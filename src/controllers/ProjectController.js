import Project from "../models/project.model.js";
import cloudinary from "cloudinary";

// @desc    Create new project
export const createProject = async (req, res) => {
  try {
    const { title, description, technologies, liveLink, githubLink } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const project = await Project.create({
      title,
      description,
      technologies: technologies ? technologies.split(",") : [],
      liveLink,
      githubLink,
      image: req.file.path,
      cloudinaryId: req.file.filename,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.cloudinaryId) {
      await cloudinary.v2.uploader.destroy(project.cloudinaryId);
    }

    await project.deleteOne();
    res.json({ message: "Project removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};