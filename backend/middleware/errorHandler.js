const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    status: err.status || 500,
    message: err.message || 'Internal Server Error'
  };

  // Supabase errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        error.status = 409;
        error.message = 'Resource already exists';
        break;
      case '23503': // Foreign key violation
        error.status = 400;
        error.message = 'Invalid reference to related resource';
        break;
      case '23514': // Check violation
        error.status = 400;
        error.message = 'Data validation failed';
        break;
      default:
        error.message = 'Database operation failed';
    }
  }

  // Validation errors
  if (err.isJoi) {
    error.status = 400;
    error.message = err.details[0].message;
  }

  res.status(error.status).json({
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;