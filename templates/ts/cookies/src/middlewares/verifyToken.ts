import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel.js';
import { JwtPayload } from '@/types/index.js';

const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from cookie instead of Authorization header
    const token = req.cookies.token;
    
    if (!token) {
      res.status(401).json({ success: false, message: "Access denied. No token provided" });
      return;
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
   
    // Fetch the full user from database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }
   
    // Add user to request object
    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email
    };
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ success: false, message: "Invalid token" });
      return;
    }
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: "Token expired" });
      return;
    }
    
    console.error("Auth middleware error:", error);
    res.status(500).json({ success: false, message: "Authentication error" });
  }
};

export default verifyToken;