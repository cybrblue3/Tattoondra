const logger = require('../utils/logger');

/**
 * Middleware to log all HTTP requests
 * Logs: method, URL, status code, response time, user ID (if authenticated)
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;

    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };

    // Add user ID if authenticated
    if (req.user) {
      logData.userId = req.user.id;
    }

    // Log based on status code
    if (res.statusCode >= 500) {
      logger.error('Server Error', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Client Error', logData);
    } else {
      logger.info('Request', logData);
    }
  });

  next();
};

module.exports = requestLogger;
