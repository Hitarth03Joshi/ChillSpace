const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
  },
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
  },
  paymentId: {
    type: String,
    required: true,
  },
  paymentIntentId: {
    type: String,
    required: true,
    unique: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentDetails: {
    cardLast4: String,
    cardBrand: String,
    cardExpiryMonth: String,
    cardExpiryYear: String,
  },
  refundDetails: {
    refundId: String,
    refundAmount: Number,
    refundReason: String,
    refundedAt: Date,
  },
  metadata: {
    type: Map,
    of: String,
  },
}, {
  timestamps: true,
});

// Indexes
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ propertyId: 1 });
paymentSchema.index({ guestId: 1 });
paymentSchema.index({ paymentId: 1 }, { unique: true });
paymentSchema.index({ orderId: 1 }, { unique: true });
paymentSchema.index({ paymentIntentId: 1 }, { unique: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment; 