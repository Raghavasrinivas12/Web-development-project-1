const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;

    // Make sure it follows "Bearer token" pattern
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        msg: "Access Denied: No authentication token found. Please log in." 
      });
    }

    const token = authHeader.split(' ')[1];

    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded data user payload to req.user
    req.user = decodedPayload;

    next();

  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    
    // Clear response differentiation if the token has expired vs if it's completely fake
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: "Authentication session expired. Please log in again." });
    }
    
    return res.status(403).json({ msg: "Authentication failed: Invalid or altered token." });
  }
};

module.exports = authMiddleware;