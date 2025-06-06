const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.details[0].message
      });
    }
    next();
  };
};

// Validation schemas
const schemas = {
  user: {
    update: Joi.object({
      full_name: Joi.string().min(1).max(100),
      level: Joi.string().min(1).max(10),
      profile_image_url: Joi.string().uri().allow('')
    }).min(1)
  },

  booking: {
    create: Joi.object({
      court_id: Joi.string().uuid().required(),
      date: Joi.date().iso().required(),
      start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      status: Joi.string().valid('pending', 'confirmed', 'canceled').default('pending')
    }),
    update: Joi.object({
      status: Joi.string().valid('pending', 'confirmed', 'canceled').required()
    })
  },

  match: {
    create: Joi.object({
      booking_id: Joi.string().uuid().required(),
      status: Joi.string().valid('pending', 'confirmed', 'completed').default('pending')
    }),
    update: Joi.object({
      status: Joi.string().valid('pending', 'confirmed', 'completed'),
      result: Joi.string().valid('win', 'loss').allow(null)
    }).min(1)
  },

  matchPlayer: {
    create: Joi.object({
      user_id: Joi.string().uuid().required(),
      team: Joi.string().valid('home', 'away').required()
    })
  }
};

module.exports = { validate, schemas };