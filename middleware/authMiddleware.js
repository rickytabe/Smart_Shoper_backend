const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization'); // Get the header without assuming it starts with 'Bearer'

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  // Check if the token starts with 'Bearer'
  if (token.startsWith('Bearer ')) {
    const tokenPart = token.split(' ')[1]; // Extract the token part
    try {
      const decoded = jwt.verify(tokenPart, process.env.JWT_SECRET_KEY);
      req.userId = decoded.userId;
      next();
    } catch (error) {
      res.status(400).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Invalid token format' });
  }
};
