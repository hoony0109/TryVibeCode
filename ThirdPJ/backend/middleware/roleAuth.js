const jwt = require('jsonwebtoken');

module.exports = function (roles) {
  return (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.admin = decoded.admin;

      if (roles && !roles.includes(req.admin.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
};
