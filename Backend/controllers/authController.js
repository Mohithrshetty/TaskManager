const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

//generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl, adminInviteToken } =
      req.body; // Destructuring the request body to get name, email, and password

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" }); // If user exists, return 400 Bad Request
    }

    //Determine user role : Admin if correct token is provided else member

    let role = "member"; // Default role is member
    if (
      adminInviteToken &&
      adminInviteToken === process.env.ADMIN_INVITE_TOKEN
    ) {
      role = "admin"; // If the correct admin invite token is provided, set role to admin
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password using the generated salt

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      role,
    });

    // If user is created successfully, return the user details and token

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id), // Generate JWT token for the user
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }); // Find the user by email

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" }); // If user not found, return 401 Unauthorized
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    // Compare the provided password with the hashed password
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" }); // If password does not match, return 401 Unauthorized
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id), // Generate JWT token for the user
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Get user profile
// @route GET /api/auth/profile
// @access Private(requires authentication)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Find the user by ID and exclude password from the result
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // If user not found, return 404 Not Found
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
// @access Private(requires authentication)
const updateUserProfile = async (req, res) => {
  try {
    const user= await User.findById(req.user.id); // Find the user by ID

    if (!user) {
      return res.status(404).json({ message: "User not found" }); // If user not found, return 404 Not Found
    }

    user.name=req.body.name || user.name; // Update the user's name if provided, otherwise keep the existing name
    user.email=req.body.email || user.email; // Update the user's email if provided, otherwise keep the existing email

    if(req.body.password) {
      const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
      user.password = await bcrypt.hash(req.body.password, salt); // Hash the new password using the generated salt
    }

    const updatedUser = await user.save(); // Save the updated user to the database
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id), // Generate JWT token for the updated user
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
