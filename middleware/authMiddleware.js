const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    console.log('Verifying token:', token); // Add logging
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('Decoded token:', decoded); // Add logging
    const user = await User.findByPk(decoded.user.id);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message); // Add logging
    res.status(401).json({ message: 'Token is not valid' });
  }
};


module.exports = authMiddleware;
