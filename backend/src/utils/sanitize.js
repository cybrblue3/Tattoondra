const xss = require('xss');

  /**
   * Sanitize user input to prevent XSS attacks
   * @param {string} input - User input to sanitize
   * @returns {string} - Sanitized safe string
   */
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') {
      return input; // Don't sanitize non-strings (numbers, booleans, etc.)
    }

    // Trim whitespace and sanitize
    return xss(input.trim());
  };

  /**
   * Sanitize an object's string fields recursively
   * @param {object} obj - Object with fields to sanitize
   * @returns {object} - Object with sanitized fields
   */
  const sanitizeObject = (obj) => {
    const sanitized = {};

    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        sanitized[key] = sanitizeInput(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitized[key] = sanitizeObject(obj[key]); // Recursive for nested objects
      } else {
        sanitized[key] = obj[key]; // Keep numbers, booleans, etc. as-is
      }
    }

    return sanitized;
  };

  module.exports = { sanitizeInput, sanitizeObject };