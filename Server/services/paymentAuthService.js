const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate a payment-specific token for a user
 * @param {Object} user - The user object
 * @returns {String} - JWT token
 */
const generatePaymentToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id,
      roleId: user.roleId,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // Shorter expiration for payment tokens
  );
};

/**
 * Verify a payment token
 * @param {String} token - The JWT token
 * @returns {Object} - Decoded token data
 */
const verifyPaymentToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired payment token');
  }
};

/**
 * Get user from token
 * @param {String} token - The JWT token
 * @returns {Promise<Object>} - User object
 */
const getUserFromToken = async (token) => {
  try {
    const decoded = verifyPaymentToken(token);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  } catch (error) {
    throw new Error('Authentication failed: ' + error.message);
  }
};

module.exports = {
  generatePaymentToken,
  verifyPaymentToken,
  getUserFromToken
}; 