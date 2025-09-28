import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided" });
    }

    const token = authHeader.split(' ')[1];
    
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