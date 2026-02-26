import Contact from "../models/contact.model.js";

export const sendMessage = async (req, res) => {
  const message = await Contact.create(req.body);
  res.status(201).json(message);
};