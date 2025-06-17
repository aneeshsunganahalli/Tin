import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../models/userModel';
import validator from 'validator';

// Generate JWT token with expiration
const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET as string,
    { expiresIn: '30d' }
  );
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
   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ success: false, message: "User with this email already exists" });
      return;
    }
   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
   
    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
     const savedUser = await newUser.save();
   
    const token = generateToken(savedUser._id as string);
   
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      }
    });
  } catch (error: any) {
    console.error("Register error:", error);
   
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: "User with this email already exists"
      });
      return;
    }
   
    res.status(500).json({
      success: false,
      message: "Failed to register user"
    });
  }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;
   
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
      return;
    }
   
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
      return;
    }
   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
      return;
    }
   
    const token = generateToken(user._id as string);
     res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login"
    });
  }
};

export { registerUser, loginUser };