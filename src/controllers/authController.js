import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

//─── Register──────────────────────────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      return next(new Error("All fields are required"));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      return next(new Error("User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// ─── Login ─────────────────────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      return next(new Error("Email and password are required"));
    }

    //✅ THE FIX: .select("+password") forces Mongoose to include the password
    // field even if the model schema has `select: false` on it
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401);
      return next(new Error("Invalid credentials"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401);
      return next(new Error("Invalid credentials"));
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};