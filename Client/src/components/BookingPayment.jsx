import React, { useState } from 'react';
import PaymentForm from './PaymentForm';
import '../styles/BookingPayment.scss';

const BookingPayment = ({ bookingData, onSuccess, onCancel }) => {
  const [showPaymentForm, setShowPaymentForm] = useState(true);
  const [paymentError, setPaymentError] = useState(null);

  const handlePaymentSuccess = (paymentIntent) => {
    setShowPaymentForm(false);
    onSuccess(paymentIntent);
  };

  const handlePaymentError = (error) => {
    setPaymentError(error.message);
  };

  return (
    <div className="booking-payment">
      {showPaymentForm ? (
        <>
          <div className="payment-header">
            <h2>Complete Your Payment</h2>
            <p>Please provide your payment details to confirm your booking</p>
          </div>
          
          <PaymentForm 
            bookingData={bookingData}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
          
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </>
      ) : (
        <div className="payment-success">
          <div className="success-icon">✓</div>
          <h2>Payment Successful!</h2>
          <p>Your booking has been confirmed.</p>
          <button className="continue-button" onClick={onSuccess}>
            Continue to My Trips
          </button>
        </div>
      )}
      
      {paymentError && (
        <div className="payment-error">
          <p>{paymentError}</p>
          <button onClick={() => setPaymentError(null)}>Dismiss</button>
        </div>
      )}
    </div>
  );
};

export default BookingPayment;
