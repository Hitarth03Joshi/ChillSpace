const express = require('express');
const router = express.Router();
const { paymentAuth, paymentPermission } = require('../middleware/paymentAuth');
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  refundPayment,
  createRazorpayOrder,
  verifyPayment,
} = require('../controllers/paymentController');

// Create Razorpay order
router.post('/create-order', createRazorpayOrder);

// Create payment intent
router.post('/create-intent', createPaymentIntent);

// Confirm payment
router.post('/confirm', confirmPayment);

// Verify payment
router.post('/verify', verifyPayment);

// Get payment history (protected route)
router.get('/history', paymentAuth, getPaymentHistory);

// Refund payment (protected route)
router.post('/refund', paymentAuth, paymentPermission, refundPayment);

module.exports = router; 