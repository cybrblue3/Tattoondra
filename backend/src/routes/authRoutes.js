const express = require('express');
  const router = express.Router();
  const { register, login } = require('../controllers/authController');
  const { verifyToken } = require('../middleware/authMiddleware');

  // PUBLIC ROUTES (No authentication required)
  
  // Register new user
  // POST /api/auth/register
  router.post('/register', register);

  // Login user
  // POST /api/auth/login
  router.post('/login', login);
  
  // PROTECTED ROUTES (Authentication required)
  
  // Get current user info
  // GET /api/auth/me
  router.get('/me', verifyToken, (req, res) => {
    // req.user is populated by verifyToken middleware
    res.json({
      message: 'Authenticated user info',
      user: req.user
    });
  });

  module.exports = router;