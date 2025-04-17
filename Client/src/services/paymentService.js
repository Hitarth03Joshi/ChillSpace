import axios from 'axios';

const API_URL = 'http://localhost:3001';

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
    const response = await axios.post(`${API_URL}/api/payments/create-intent`, bookingData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create payment intent');
  }
};

export const confirmPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/api/payments/confirm`, paymentData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to confirm payment');
  }
};

export const getPaymentHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/payments/history`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch payment history');
  }
};

export const refundPayment = async (paymentId, reason) => {
  try {
    const response = await axios.post(`${API_URL}/api/payments/refund`, { paymentId, reason });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to process refund');
  }
};

export const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (bookingData) => {
  try {
    const response = await axios.post(`${API_URL}/api/payments/create-order`, bookingData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create Razorpay order');
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/api/payments/verify`, paymentData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify payment');
  }
}; 