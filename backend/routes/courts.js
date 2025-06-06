const express = require('express');
const router = express.Router();
const courtController = require('../controllers/courts');

// GET /api/courts - Get all courts with optional filtering
router.get('/', courtController.getAllCourts);

// GET /api/courts/:id - Get single court by ID
router.get('/:id', courtController.getCourtById);

// GET /api/courts/:id/availability - Get court availability for a date
router.get('/:id/availability', courtController.getCourtAvailability);

module.exports = router;