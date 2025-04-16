const express = require('express');
const router = express.Router();
const { paymentAuth, paymentPermission } = require('../middleware/paymentAuth');
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  refundPayment,
} = require('../controllers/paymentController');

// Create payment intent
router.post('/create-intent', createPaymentIntent);

// Confirm payment
router.post('/confirm', confirmPayment);

// Get payment history (protected route)
router.get('/history', paymentAuth, getPaymentHistory);

// Refund payment (protected route)
router.post('/refund', paymentAuth, paymentPermission, refundPayment);

module.exports = router; 