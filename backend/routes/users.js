const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const { validate, schemas } = require('../middleware/validation');

// GET /api/users/:id - Get user profile
router.get('/:id', userController.getProfile);

// PUT /api/users/:id - Update user profile
router.put('/:id', validate(schemas.user.update), userController.updateProfile);

// POST /api/users - Create user profile (after auth signup)
router.post('/', userController.createProfile);

module.exports = router;