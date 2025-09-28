import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import validator from 'validator';
import User from '../models/userModel.js';
import { TOKEN_EXPIRY, COOKIE_EXPIRY } from '../types/constants.js';
import { CookieOptions, JwtPayload } from '../types/index.js';

// Generate JWT token with expiration
const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET as string,
    { expiresIn: TOKEN_EXPIRY }
  );
};

// Cookie options based on environment
const getCookieOptions = (): CookieOptions => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only use secure in production
    sameSite: 'strict',
    maxAge: COOKIE_EXPIRY,
    path: '/'
  };
};

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password }: { username: string; email: string; password: string } = req.body;
   
    if (!username || !email || !password) {
      res.status(400).json({ success: false, message: "Please fill all required fields" });
      return;
    }
    
    if (!validator.isEmail(email)) {
      res.status(400).json({ success: false, message: "Please enter a valid email" });
      return;
    }
    
    if (password.length < 6) {
      res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
      return;
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ success: false, message: "User with this email already exists" });
      return;
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
    const token = generateToken(savedUser._id.toString());
    
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
  } catch (error: any) {
    console.error("Register error:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      res.status(409).json({ success: false, message: "User with this email already exists" });
      return;
    }
    
    res.status(500).json({ success: false, message: "Failed to register user" });
  }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required" });
      return;
    }
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }
    
    // Generate token
    const token = generateToken(user._id.toString());
    
    // Set cookie with token
    res.cookie('token', token, getCookieOptions());
    
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Failed to login" });
  }
};

const logoutUser = async (req: Request, res: Response): Promise<void> => {
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
    res.status(500).json({ success: false, message: "Failed to logout" });
  }
};

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }
    
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

export { registerUser, loginUser, logoutUser, getCurrentUser };