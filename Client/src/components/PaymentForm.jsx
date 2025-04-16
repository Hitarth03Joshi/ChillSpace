import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent, confirmPayment, setPaymentToken } from '../services/paymentService';
import '../styles/PaymentForm.scss';

const stripePromise = loadStripe('your_publishable_key'); // Replace with your Stripe publishable key

const PaymentFormContent = ({ bookingData, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const { clientSecret, paymentToken } = await createPaymentIntent(bookingData);
      
      // Store the payment token
      if (paymentToken) {
        setPaymentToken(paymentToken);
      }

      // Confirm the payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: bookingData.guestName,
            email: bookingData.guestEmail,
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Confirm payment on our backend
      await confirmPayment(paymentIntent.id);
      onSuccess(paymentIntent);
    } catch (err) {
      setError(err.message);
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-header">
        <h2>Complete Your Booking</h2>
        <p className="booking-summary">
          Total Amount: ${bookingData.totalAmount}
        </p>
      </div>

      <div className="card-element-container">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`submit-button ${loading ? 'loading' : ''}`}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const PaymentForm = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent {...props} />
    </Elements>
  );
};

export default PaymentForm; 