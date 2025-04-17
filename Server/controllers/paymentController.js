const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { generatePaymentToken } = require('../services/paymentAuthService');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createRazorpayOrder = async (req, res) => {
  try {
    const { listingId, startDate, endDate, guestName, guestEmail } = req.body;

    // Get listing details to calculate total amount
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Get or create guest user
    let guest = await User.findOne({ email: guestEmail });
    if (!guest) {
      guest = await User.create({
        firstName: guestName.split(' ')[0] || guestName,
        lastName: guestName.split(' ')[1] || '',
        email: guestEmail,
        roleId: process.env.GUEST_ROLE_ID,
      });
    }

    // Calculate number of nights
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Calculate total amount
    const totalAmount = listing.price * nights;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // Amount in cents
      currency: 'USD', // Changed from INR to USD
      receipt: `booking_${Date.now()}`,
      notes: {
        listingId,
        startDate,
        endDate,
        guestId: guest._id.toString(),
        guestName: `${guest.firstName} ${guest.lastName}`.trim(),
        guestEmail,
        nights
      }
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ message: 'Failed to create Razorpay order' });
  }
};

const createPaymentIntent = async (req, res) => {
  try {
    const { propertyId, startDate, endDate, guestName, guestEmail } = req.body;

    // Get property details to calculate total amount
    const property = await Listing.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Get or create guest user
    let guest = await User.findOne({ email: guestEmail });
    if (!guest) {
      // Create a new guest user with minimal information
      guest = await User.create({
        firstName: guestName.split(' ')[0] || guestName,
        lastName: guestName.split(' ')[1] || '',
        email: guestEmail,
        roleId: process.env.GUEST_ROLE_ID, // Make sure this environment variable is set
      });
    }

    // Calculate number of nights
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Calculate total amount
    const totalAmount = property.price * nights;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      receipt: `booking_${Date.now()}`,
      notes: {
        propertyId,
        startDate,
        endDate,
        guestId: guest._id.toString(),
        guestName: `${guest.firstName} ${guest.lastName}`.trim(),
        guestEmail,
        nights
      }
    });

    // Generate a payment-specific token
    const paymentToken = generatePaymentToken(guest);

    res.json({
      orderId: order.id,
      totalAmount,
      paymentToken,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Get the order details
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Create booking record
    const booking = new Booking({
      propertyId: order.notes.propertyId,
      startDate: order.notes.startDate,
      endDate: order.notes.endDate,
      guestName: order.notes.guestName,
      guestEmail: order.notes.guestEmail,
      totalAmount: order.amount / 100,
      paymentIntentId: razorpay_payment_id,
      status: 'confirmed',
    });

    await booking.save();

    // Create payment record
    const paymentRecord = new Payment({
      bookingId: booking._id,
      propertyId: order.notes.propertyId,
      guestId: order.notes.guestId,
      amount: order.amount / 100,
      currency: 'USD', // Changed from INR to USD
      paymentId: razorpay_payment_id,
      paymentIntentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentMethod: payment.method,
      status: 'succeeded',
      paymentDetails: {
        cardLast4: payment.card?.last4,
        cardBrand: payment.card?.network,
        cardExpiryMonth: payment.card?.expiry_month,
        cardExpiryYear: payment.card?.expiry_year,
      },
      metadata: order.notes,
    });

    await paymentRecord.save();

    // Update property availability
    await Listing.findByIdAndUpdate(
      order.notes.propertyId,
      {
        $push: {
          bookedDates: {
            startDate: order.notes.startDate,
            endDate: order.notes.endDate,
          },
        },
      }
    );

    res.json({
      message: 'Payment confirmed and booking created',
      booking,
      payment: paymentRecord,
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Failed to confirm payment' });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ guestId: req.user._id })
      .populate('bookingId')
      .populate('propertyId')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ message: 'Failed to fetch payment history' });
  }
};

const refundPayment = async (req, res) => {
  try {
    const { paymentId, reason } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if payment belongs to the user
    if (payment.guestId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Create refund in Razorpay
    const refund = await razorpay.payments.refund(payment.paymentId, {
      amount: payment.amount * 100, // Convert to paise
      notes: {
        reason: reason || 'requested_by_customer',
      },
    });

    // Update payment record
    payment.status = 'refunded';
    payment.refundDetails = {
      refundId: refund.id,
      refundAmount: refund.amount / 100,
      refundReason: reason,
      refundedAt: new Date(),
    };

    await payment.save();

    // Update booking status
    await Booking.findByIdAndUpdate(payment.bookingId, {
      status: 'cancelled',
    });

    res.json({
      message: 'Payment refunded successfully',
      refund: payment.refundDetails,
    });
  } catch (error) {
    console.error('Payment refund error:', error);
    res.status(500).json({ message: 'Failed to refund payment' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ 
        verified: false,
        message: 'Invalid payment signature' 
      });
    }

    // Get the payment details
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    // Get the order details
    const order = await razorpay.orders.fetch(razorpay_order_id);

    // Get the listing to find the host ID
    const listing = await Listing.findById(order.notes.listingId);
    if (!listing) {
      return res.status(404).json({ 
        verified: false,
        message: 'Listing not found' 
      });
    }

    // Create booking record
    const booking = new Booking({
      customerId: order.notes.guestId,
      hostId: listing.creator,
      listingId: order.notes.listingId,
      startDate: order.notes.startDate,
      endDate: order.notes.endDate,
      guestName: order.notes.guestName,
      guestEmail: order.notes.guestEmail,
      totalAmount: order.amount / 100, // Convert cents to dollars
      paymentIntentId: razorpay_payment_id,
      status: 'confirmed',
    });

    await booking.save();

    // Create payment record
    const paymentRecord = new Payment({
      bookingId: booking._id,
      propertyId: order.notes.listingId,
      guestId: order.notes.guestId,
      amount: order.amount / 100, // Convert cents to dollars
      currency: 'USD', // Changed from INR to USD
      paymentId: razorpay_payment_id,
      paymentIntentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentMethod: payment.method,
      status: 'succeeded',
      paymentDetails: {
        cardLast4: payment.card?.last4,
        cardBrand: payment.card?.network,
        cardExpiryMonth: payment.card?.expiry_month,
        cardExpiryYear: payment.card?.expiry_year,
      },
      metadata: order.notes,
    });

    await paymentRecord.save();

    // Update listing availability
    await Listing.findByIdAndUpdate(
      order.notes.listingId,
      {
        $push: {
          bookedDates: {
            startDate: order.notes.startDate,
            endDate: order.notes.endDate,
          },
        },
      }
    );

    res.json({
      verified: true,
      payment: paymentRecord,
      booking: booking
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      verified: false,
      message: 'Failed to verify payment' 
    });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  refundPayment,
  createRazorpayOrder,
  verifyPayment,
}; 