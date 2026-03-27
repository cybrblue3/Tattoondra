const rateLimit = require('express-rate-limit');

  // Strict rate limiter for authentication endpoints (login, register)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: {
      error: 'Demasiados intentos de inicio de sesión. Por favor intenta de nuevo en 15 minutos.',
      retryAfter: 15
    },
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false
  });

  // General API rate limiter for all other endpoints
  const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: {
      error: 'Demasiadas solicitudes. Por favor espera un momento antes de reintentar.',
      retryAfter: 1
    },
    standardHeaders: true,
    legacyHeaders: false
  });

  module.exports = { authLimiter, apiLimiter };