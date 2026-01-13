const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Trim and validate name
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters long" });
    }
    if (trimmedName.length > 50) {
      return res.status(400).json({ message: "Name cannot exceed 50 characters" });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }
    if (password.length > 128) {
      return res.status(400).json({ message: "Password cannot exceed 128 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({ 
      name: trimmedName, 
      email: email.toLowerCase().trim(), 
      password: hashedPassword 
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Save token to user
    user.token = token;
    await user.save();

    res.status(201).json({ 
      name: user.name, 
      email: user.email, 
      token 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Save token to user
    user.token = token;
    await user.save();

    res.status(200).json({ 
      name: user.name, 
      email: user.email, 
      token 
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Get token from Authorization header or body
    const token = req.headers.authorization?.replace("Bearer ", "") || req.body.token;
    
    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }

    // Find user by token
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Clear token
    user.token = null;
    await user.save();

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const getUser = async (req, res) => {
  try {
    // Get user from request (set by auth middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find user by ID
    const user = await User.findById(req.user.id).select("-password -token");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      name: user.name, 
      email: user.email,
      id: user._id 
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = { registerUser, loginUser, logoutUser, getUser };