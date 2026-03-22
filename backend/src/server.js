// Tattoondra Backend Server
// Main entry point

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
// Import routes
  const authRoutes = require('./routes/authRoutes');
  const clientRoutes = require('./routes/clientRoutes');
  const appointmentRoutes = require('./routes/appointmentRoutes');
  const paymentRoutes = require('./routes/paymentRoutes');
  const googleAuthRoutes = require('./routes/googleAuthRoutes');
  const materialRoutes = require('./routes/materialRoutes');
  const analyticsRoutes = require('./routes/analyticsRoutes');

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Tattoondra API is running',
    timestamp: new Date().toISOString()
  });
});

// Auth routes
  app.use('/api/auth', authRoutes);
  
// Client routes
  app.use('/api/clients', clientRoutes);

// Appointment routes
  app.use('/api/appointments', appointmentRoutes);

// Payment routes
  app.use('/api/payments', paymentRoutes);

// Google Auth routes
  app.use('/api/auth', googleAuthRoutes);

// Material/Inventory routes
  app.use('/api/materials', materialRoutes);

// Analytics routes
  app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Tattoondra API running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
