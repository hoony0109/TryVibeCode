const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // console.log('[DEBUG] Auth middleware called.');
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    // console.log('[DEBUG] No token found.');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const secretKey = process.env.SECRET_KEY || 'default_secret_key_for_development';
    // console.log('[DEBUG] Using secret key:', secretKey ? 'SECRET_KEY found' : 'Using default key');
    const decoded = jwt.verify(token, secretKey);
    req.admin = decoded.admin;
    // console.log('[DEBUG] Token verified. Admin:', req.admin);
    next();
  } catch (err) {
    // console.error('[DEBUG] Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
