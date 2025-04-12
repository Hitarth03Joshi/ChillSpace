const routes = require('express').Router();
const bookingController = require('../controllers/BookingController');

routes.post('/create', bookingController.addBooking);
module.exports = routes;