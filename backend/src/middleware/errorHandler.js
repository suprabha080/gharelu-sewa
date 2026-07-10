export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.code === '23505') {
    // Unique constraint violation
    statusCode = 409;
    message = 'This record already exists';
  }

  if (err.code === '23503') {
    // Foreign key violation
    statusCode = 400;
    message = 'Invalid reference';
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// 404 handler
export const notFound = (req, res) => {
  res.status(404).json({
    error: `Route ${req.originalUrl} not found`,
  });
};
