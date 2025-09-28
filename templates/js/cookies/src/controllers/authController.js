import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import validator from 'validator';

// JWT and cookie options configuration
const TOKEN_EXPIRY = '30d';
const COOKIE_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

// Generate JWT token with expiration
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: TOKEN_EXPIRY }
  );
};

// Cookie options based on environment
const getCookieOptions = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only use secure in production
    sameSite: 'strict',
    maxAge: COOKIE_EXPIRY,
    path: '/'
  };
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    
    const savedUser = await newUser.save();

    // Generate token
    const token = generateToken(savedUser._id);
    
    // Set cookie with token
    res.cookie('token', token, getCookieOptions());
    
    res.status(201).json({
      success: true, 
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false, 
        message: "User with this email already exists" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to register user" 
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Generate token
    const token = generateToken(user._id);
    
    // Set cookie with token
    res.cookie('token', token, getCookieOptions());

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to login" 
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Clear the cookie
    res.cookie('token', '', { 
      httpOnly: true, 
      expires: new Date(0), 
      path: '/' 
    });
    
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to logout" 
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user"
    });
  }
};

export { registerUser, loginUser, logoutUser, getCurrentUser };