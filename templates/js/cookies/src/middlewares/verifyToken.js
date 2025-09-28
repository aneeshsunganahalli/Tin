import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  try {
    // Get token from cookie instead of Authorization header
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user to request object
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    
    console.error("Auth middleware error:", error);
    res.status(500).json({ success: false, message: "Authentication error" });
  }
};

export default verifyToken;