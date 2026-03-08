 const jwt = require('jsonwebtoken');

  // VERIFY JWT TOKEN MIDDLEWARE
  
  const verifyToken = (req, res, next) => {
    try {
      // 1. Get token from Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          error: 'Access denied. No token provided.'
        });
      }

      // 2. Extract token (format: "Bearer <token>")
      const token = authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          error: 'Access denied. Invalid token format.'
        });
      }

      // 3. Verify token signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Attach user info to request object
      req.user = decoded;

      // 5. Pass control to next middleware/route handler
      next();

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: 'Token expired. Please login again.'
        });
      }

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          error: 'Invalid token.'
        });
      }

      res.status(500).json({
        error: 'Failed to authenticate token.',
        details: error.message
      });
    }
  };

  // CHECK USER ROLE MIDDLEWARE (Optional - for later)
  
  const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required'
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          error: 'Access forbidden. Insufficient permissions.'
        });
      }

      next();
    };
  };

  module.exports = {
    verifyToken,
    checkRole
  };