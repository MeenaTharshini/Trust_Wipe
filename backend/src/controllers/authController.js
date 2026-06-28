import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

// ===============================
// REGISTER USER
// ===============================

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ---------------- Validation ----------------

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // ---------------- Check Existing User ----------------

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }

    // ---------------- Hash Password ----------------

    const hashedPassword = await bcrypt.hash(password, 10);

    // ---------------- Save User ----------------

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Registration successful.",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// LOGIN USER
// ===============================

export const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    // ---------------- Validation ----------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required.",
      });
    }

    // ---------------- Find User ----------------

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ---------------- Compare Password ----------------

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ---------------- Generate JWT ----------------

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    // ---------------- Response ----------------

    res.json({
      success: true,
      message: "Login successful.",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};