const router = require("express").Router()
const Booking = require("../models/Booking")

/* CREATE BOOKING */
const addBooking =async (req, res) => {
  try {
    // const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body
    // const newBooking = new Booking({ customerId, hostId, listingId, startDate, endDate, totalPrice })
    const newBooking = await Booking.create(req.body)
    res.status(200).json(newBooking)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Fail to create a new Booking!", error: err.message })
  }
}

module.exports = {addBooking}