const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

const registerBuyer = async (req, res) => {
  try {
    const { username, email, password, phonenumber } = req.body;

    // Validate input
    if (!username || !email || !password || !phonenumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      username,
      email,
      phonenumber,
      password: hashedPassword,
    });

    // Generate token
    const token = jwt.sign(
      { user: { id: newUser.id } },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    res
      .status(201)
      .json({
        message: "User registered successfully",
        token,
        username: newUser.username,
        email: newUser.email,
        phonenumber: newUser.phonenumber,
      });
  } catch (error) {
    console.error("Error registering user:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error });
  }
};

const loginBuyer = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { user: { id: user.id } },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.json({ token, username: user.username, email: user.email });
  } catch (error) {
    console.error("Error logging in user:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getBuyer = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
 const getAllBuyers = async (req, res) => {
  try {
    const users = await User.findAll(); // Fetch all users from the database
    res.json(users); // Send the users as a JSON response
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
 const updateBuyer = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update user data (handle password hashing if necessary)
    await user.update({ username, email, password });
    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

 const deleteBuyer = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy();
    res.status(204).end(); // 204 No Content - successful deletion
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

module.exports = {
  registerBuyer,
  loginBuyer,
  getAllBuyers,
  updateBuyer,
  deleteBuyer,
};
