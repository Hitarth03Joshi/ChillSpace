const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { generatePaymentToken } = require('../services/paymentAuthService');

const createPaymentIntent = async (req, res) => {
  try {
    const { propertyId, startDate, endDate, guestName, guestEmail } = req.body;

    // Get property details to calculate total amount
    const property = await Property.findById(propertyId);
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
    const totalAmount = property.pricePerNight * nights;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        propertyId,
        startDate,
        endDate,
        guestId: guest._id,
        guestName: `${guest.firstName} ${guest.lastName}`.trim(),
        guestEmail,
        nights,
      },
    });

    // Generate a payment-specific token
    const paymentToken = generatePaymentToken(guest);

    res.json({
      clientSecret: paymentIntent.client_secret,
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
    const { paymentIntentId } = req.body;

    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Create booking record
      const booking = new Booking({
        propertyId: paymentIntent.metadata.propertyId,
        startDate: paymentIntent.metadata.startDate,
        endDate: paymentIntent.metadata.endDate,
        guestName: paymentIntent.metadata.guestName,
        guestEmail: paymentIntent.metadata.guestEmail,
        totalAmount: paymentIntent.amount / 100,
        paymentIntentId,
        status: 'confirmed',
      });

      await booking.save();

      // Create payment record
      const payment = new Payment({
        bookingId: booking._id,
        propertyId: paymentIntent.metadata.propertyId,
        guestId: paymentIntent.metadata.guestId,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        paymentIntentId,
        paymentMethod: paymentIntent.payment_method_types[0],
        status: 'succeeded',
        paymentDetails: {
          cardLast4: paymentIntent.payment_method_details?.card?.last4,
          cardBrand: paymentIntent.payment_method_details?.card?.brand,
          cardExpiryMonth: paymentIntent.payment_method_details?.card?.exp_month,
          cardExpiryYear: paymentIntent.payment_method_details?.card?.exp_year,
        },
        metadata: new Map(Object.entries(paymentIntent.metadata)),
      });

      await payment.save();

      // Update property availability
      await Property.findByIdAndUpdate(
        paymentIntent.metadata.propertyId,
        {
          $push: {
            bookedDates: {
              startDate: paymentIntent.metadata.startDate,
              endDate: paymentIntent.metadata.endDate,
            },
          },
        }
      );

      res.json({
        message: 'Payment confirmed and booking created',
        booking,
        payment,
      });
    } else {
      res.status(400).json({ message: 'Payment not successful' });
    }
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

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.paymentIntentId,
      reason: reason || 'requested_by_customer',
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

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  refundPayment,
}; 