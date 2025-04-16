import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Store the payment token
let paymentToken = null;

export const setPaymentToken = (token) => {
  paymentToken = token;
};

export const getPaymentToken = () => {
  return paymentToken;
};

// Create headers with payment token if available
const getHeaders = () => {
  const headers = {};
  if (paymentToken) {
    headers['Authorization'] = `Bearer ${paymentToken}`;
  }
  return headers;
};

export const createPaymentIntent = async (bookingData) => {
  try {
    const response = await axios.post(`${API_URL}/payments/create-intent`, bookingData);
    
    // Store the payment token if provided
    if (response.data.paymentToken) {
      setPaymentToken(response.data.paymentToken);
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create payment intent');
  }
};

export const confirmPayment = async (paymentIntentId) => {
  try {
    const response = await axios.post(`${API_URL}/payments/confirm`, { paymentIntentId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to confirm payment');
  }
};

export const getPaymentHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/payments/history`, {
      headers: getHeaders()
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch payment history');
  }
};

export const refundPayment = async (paymentId, reason) => {
  try {
    const response = await axios.post(
      `${API_URL}/payments/refund`, 
      { paymentId, reason },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to refund payment');
  }
}; 