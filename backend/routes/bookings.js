const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookings');
const { validate, schemas } = require('../middleware/validation');

// GET /api/bookings - Get all bookings for authenticated user
router.get('/', bookingController.getUserBookings);

// POST /api/bookings - Create new booking
router.post('/', validate(schemas.booking.create), bookingController.createBooking);

// PUT /api/bookings/:id - Update booking status
router.put('/:id', validate(schemas.booking.update), bookingController.updateBooking);

// DELETE /api/bookings/:id - Delete booking
router.delete('/:id', bookingController.deleteBooking);

// GET /api/bookings/by-court/:courtId - Get bookings for specific court
router.get('/by-court/:courtId', bookingController.getCourtBookings);

module.exports = router;