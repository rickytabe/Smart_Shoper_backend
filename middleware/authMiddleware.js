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


const vendorAuthMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const vendorId = decoded.vendor.id;

    const vendor = await Vendor.findByPk(vendorId);

    if (!vendor) {
      return res.status(401).json({ message: 'Unauthorized: Vendor not found' });
    }

    req.vendor = vendor; // Attach vendor to the request object
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};


const isVendor = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id); // Fetch the user from the database

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    if (user.role !== 'vendor') {
      return res.status(403).json({ message: 'Unauthorized: Only vendors can access this resource' });
    }
    // For updateProduct and deleteProduct, check if the user is the vendor of the product
    if (req.path.includes('/updateProduct') || req.path.includes('/deleteProduct')) {
        const productId = req.params.id;
        const product = await Product.findByPk(productId);
        if (!product || product.vendorId !== user.id) {
          return res.status(403).json({ message: 'Unauthorized: You are not the vendor of this product.' });
        }
      }
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error checking user role:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports ={
  authMiddleware,
  vendorAuthMiddleware,
  isVendor
};
