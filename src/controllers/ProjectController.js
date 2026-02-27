import Project from "../models/project.model.js";

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    return res.json(projects);
  } catch (error) {
    console.error("Get Projects Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.json(project);
  } catch (error) {
    console.error("Get Project Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    console.log("Creating project with body:", req.body);
    console.log("Uploaded file:", req.file);

    const projectData = { ...req.body };

    // Process image if uploaded
    if (req.file) {
      projectData.image = `/uploads/${req.file.filename}`;
    }

    // Parse techStack string into array
    if (
      typeof projectData.techStack === "string" &&
      projectData.techStack.trim() !== ""
    ) {
      projectData.techStack = projectData.techStack
        .split(",")
        .map((s) => s.trim());
    } else if (typeof projectData.techStack === "string") {
      projectData.techStack = [];
    }

    // Normalize boolean for featured
    if (projectData.featured === "true") projectData.featured = true;
    if (projectData.featured === "false") projectData.featured = false;

    console.log("Project data being saved:", projectData);

    const project = new Project(projectData);
    await project.save();

    console.log("Project created successfully:", project);
    return res.status(201).json(project);
  } catch (error) {
    console.error("Create Project Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    console.log("Updating project with body:", req.body);

    const projectData = { ...req.body };

    if (req.file) {
      projectData.image = `/uploads/${req.file.filename}`;
    }

    // Parse techStack string into array
    if (
      typeof projectData.techStack === "string" &&
      projectData.techStack.trim() !== ""
    ) {
      projectData.techStack = projectData.techStack
        .split(",")
        .map((s) => s.trim());
    } else if (typeof projectData.techStack === "string") {
      projectData.techStack = [];
    }

    if (projectData.featured === "true") projectData.featured = true;
    if (projectData.featured === "false") projectData.featured = false;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      projectData,
      {
        new: true,
      },
    );

    if (!project) return res.status(404).json({ message: "Project not found" });
    return res.json(project);
  } catch (error) {
    console.error("Update Project Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.json({ message: "Project deleted successfully", project });
  } catch (error) {
    console.error("Delete Project Error:", error);
    return res.status(500).json({ message: error.message });
  }
};
