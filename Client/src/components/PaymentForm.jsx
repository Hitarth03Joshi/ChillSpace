import React, { useState, useEffect } from 'react';
import { createRazorpayOrder, initializeRazorpay, verifyPayment } from '../services/paymentService';
import '../styles/PaymentForm.scss';

const PaymentForm = ({ bookingData, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize Razorpay script
    initializeRazorpay();
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create Razorpay order
      const order = await createRazorpayOrder(bookingData);

      // Initialize Razorpay payment
      const options = {
        key: "rzp_test_xX1PSLY0vlu4TL",
        amount: order.amount,
        currency: order.currency,
        name: 'ChillSpace',
        description: `Booking for ${bookingData.listingName || 'Property'}`,
        order_id: order.orderId,
        handler: async (response) => {
          try {
            // Verify payment
            const verification = await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verification.verified) {
              onSuccess(verification.payment);
            } else {
              throw new Error(verification.message || 'Payment verification failed');
            }
          } catch (error) {
            setError(error.message);
            onError(error);
          }
        },
        prefill: {
          name: bookingData.userName || bookingData.guestName,
          email: bookingData.userEmail || bookingData.guestEmail,
          contact: bookingData.userPhone || ''
        },
        theme: {
          color: '#4CAF50'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setError(error.message);
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <div className="payment-summary">
        <h3>Payment Summary</h3>
        <div className="summary-item">
          <span>Listing:</span>
          <span>{bookingData.listingName || 'Property'}</span>
        </div>
        <div className="summary-item">
          <span>Check-in:</span>
          <span>{new Date(bookingData.checkIn || bookingData.startDate).toLocaleDateString()}</span>
        </div>
        <div className="summary-item">
          <span>Check-out:</span>
          <span>{new Date(bookingData.checkOut || bookingData.endDate).toLocaleDateString()}</span>
        </div>
        <div className="summary-item total">
          <span>Total Amount:</span>
          <span>${bookingData.totalAmount}</span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <button
        className="pay-button"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default PaymentForm; 