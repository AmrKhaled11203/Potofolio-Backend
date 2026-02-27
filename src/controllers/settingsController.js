import Settings from "../models/settings.model.js";

export const getSettings = async (req, res) => {
  const settings = await Settings.findOne();
  res.json(settings);
};

export const updateSettings = async (req, res) => {
  try {
    const data = { ...req.body };

    // Handle multiple file uploads
    if (req.files) {
      if (req.files.profilePic) {
        data.profilePic = `/uploads/${req.files.profilePic[0].filename}`;
      }
      if (req.files.bannerImage) {
        data.bannerImage = `/uploads/${req.files.bannerImage[0].filename}`;
      }
    }

    if (typeof data.socialLinks === "string") {
      try {
        data.socialLinks = JSON.parse(data.socialLinks);
      } catch (e) {
        // If not valid JSON, maybe handle as comma separated or something?
        // For now, let's assume JSON from the frontend for complex structures.
      }
    }

    const updated = await Settings.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
