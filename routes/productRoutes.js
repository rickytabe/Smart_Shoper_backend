const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, isVendor } = require('../middleware/authMiddleware'); // Import authMiddleware

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all products
router.get('/', productController.getProducts);

// Get a single product
router.get('/:id', productController.getProduct);

// Create a new product (only for vendors)
router.post('/createProduct', isVendor, productController.createProduct);

// Update a product (only for vendors of that product)
router.put('/updateProduct/:id', isVendor, productController.updateProduct);

// Delete a product (only for vendors of that product)
router.delete('/deleteProduct/:id', isVendor, productController.deleteProduct);

module.exports = router;
