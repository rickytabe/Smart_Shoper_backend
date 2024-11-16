const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware'); // Assuming you have authMiddleware

// Public routes (no authentication needed)
router.get('/categories', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/vendors/:categoryId', categoryController.getVendorsByCategory);
router.get('/search', categoryController.searchCategories);


module.exports = router;
