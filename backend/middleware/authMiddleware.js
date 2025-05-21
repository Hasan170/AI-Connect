// Basic authentication middleware for admin routes

// Verify if the user token is valid
exports.verifyToken = (req, res, next) => {
  // For now, using a simplified approach since it appears you're not using JWT tokens yet
  // In a production environment, you'd validate a JWT token here
  
  // For development purposes, we'll just continue the request
  console.log('Token verification skipped in development mode');
  next();
};

// Check if the user is an admin
exports.isAdmin = (req, res, next) => {
  // For now, allowing all requests through
  // In production, you'd check req.user.role === 'admin' after token verification
  
  console.log('Admin check skipped in development mode');
  next();
};