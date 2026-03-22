const express = require('express');
  const router = express.Router();
  const { getDashboardAnalytics, getFinanceAnalytics } = require('../controllers/analyticsController');
  const { verifyToken } = require('../middleware/authMiddleware');

  // GET /api/analytics/dashboard - Get all dashboard metrics
  router.get('/dashboard', verifyToken, getDashboardAnalytics);
  // GET /api/analytics/finance - Get detailed finance analytics
  router.get('/finance', verifyToken, getFinanceAnalytics);

  module.exports = router;