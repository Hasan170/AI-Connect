module.exports = (err, req, res, next) => {
  console.error('ERROR:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};