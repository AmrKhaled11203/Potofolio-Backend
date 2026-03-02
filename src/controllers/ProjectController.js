import Project from "../models/project.model.js";
import { v2 as cloudinary } from 'cloudinary';

// @desc    Get all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
      technologies: technologies ? technologies.split(',').map(t => t.trim()) : [],
      liveLink,
      githubLink,
      image: req.file.path, // Cloudinary URL
      cloudinaryId: req.file.filename // Cloudinary Public ID
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

    // Delete image from Cloudinary
    if (project.cloudinaryId) {
      await cloudinary.uploader.destroy(project.cloudinaryId);
    }

    await project.deleteOne();
    res.json({ message: "Project removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
