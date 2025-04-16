const { getUserFromToken } = require('../services/paymentAuthService');

/**
 * Middleware to authenticate payment requests
 */
const paymentAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    // Get user from token
    const user = await getUserFromToken(token);
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Payment auth middleware error:', error);
    res.status(401).json({ message: error.message || 'Authentication failed' });
  }
};

/**
 * Middleware to check if user has permission to access payment
 * @param {String} paymentId - The payment ID to check
 */
const paymentPermission = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    
    // If no paymentId provided, skip permission check
    if (!paymentId) {
      return next();
    }
    
    // Get payment from database
    const Payment = require('../models/Payment');
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Check if user is the owner of the payment or an admin
    const isOwner = payment.guestId.toString() === req.user._id.toString();
    const isAdmin = req.user.roleId.toString() === process.env.ADMIN_ROLE_ID;
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    
    // Add payment to request object
    req.payment = payment;
    next();
  } catch (error) {
    console.error('Payment permission middleware error:', error);
    res.status(500).json({ message: 'Error checking payment permissions' });
  }
};

module.exports = {
  paymentAuth,
  paymentPermission
}; 