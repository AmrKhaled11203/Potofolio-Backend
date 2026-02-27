import Project from "../models/project.model.js";

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    // Exact Skill logic pattern
    const projectData = { ...req.body };
    if (req.file) {
      projectData.image = `/uploads/${req.file.filename}`;
    }

    // TechStack parsing is required because Mongoose expects [String]
    if (typeof projectData.techStack === "string" && projectData.techStack) {
      projectData.techStack = projectData.techStack
        .split(",")
        .map((s) => s.trim());
    }

    const project = new Project(projectData);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error("DEBUG: Project Save Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const projectData = { ...req.body };
    if (req.file) {
      projectData.image = `/uploads/${req.file.filename}`;
    }

    if (typeof projectData.techStack === "string" && projectData.techStack) {
      projectData.techStack = projectData.techStack
        .split(",")
        .map((s) => s.trim());
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      projectData,
      {
        new: true,
      },
    );
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
