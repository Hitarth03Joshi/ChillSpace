const router = require("express").Router()
const Booking = require("../models/Booking")

/* CREATE BOOKING */
const addBooking = async (req, res) => {
  try {
    const {
      customerId,
      hostId,
      listingId,
      startDate,
      endDate,
      guestName,
      guestEmail,
      totalAmount,
      paymentIntentId
    } = req.body;

    // Validate required fields
    if (!listingId || !startDate || !endDate || !guestName || !guestEmail || !totalAmount || !paymentIntentId) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["listingId", "startDate", "endDate", "guestName", "guestEmail", "totalAmount", "paymentIntentId"]
      });
    }

    // Create new booking
    const newBooking = new Booking({
      customerId,
      hostId,
      listingId,
      startDate,
      endDate,
      guestName,
      guestEmail,
      totalAmount,
      paymentIntentId,
      status: "confirmed"
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to create a new Booking!", error: err.message });
  }
};

module.exports = { addBooking };