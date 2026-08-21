const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'estatehub_super_secret_jwt_key_2026';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    // "Bearer <token>" ya direct token dono format handle karein
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7, authHeader.length).trim()
      : authHeader.trim();

    if (!token) {
      return res.status(401).json({ message: 'Token format is invalid' });
    }

    // Verify token with same secret key
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;