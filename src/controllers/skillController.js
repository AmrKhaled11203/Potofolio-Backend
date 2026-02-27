import Skill from "../models/skill.model.js";

export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSkill = async (req, res) => {
  try {
    const skillData = { ...req.body };
    if (req.file) {
      skillData.icon = `/uploads/${req.file.filename}`;
    }
    const skill = new Skill(skillData);
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const skillData = { ...req.body };
    if (req.file) {
      skillData.icon = `/uploads/${req.file.filename}`;
    }
    const skill = await Skill.findByIdAndUpdate(req.params.id, skillData, {
      new: true,
    });
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.json({ message: "Skill deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
